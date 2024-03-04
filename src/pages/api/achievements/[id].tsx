import { kv } from "@vercel/kv";
import { XMLParser } from "fast-xml-parser";
import { NextApiRequest, NextApiResponse } from "next";

const parser = new XMLParser({
	isArray: (name) => name === "achievement",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const gameId = req.query.id as string;
		if (isNaN(parseInt(gameId))) {
			return res.status(400).json({ error: "Invalid game id" });
		}
		const data = await getAchievementProgress(req.query.id as string);
		res.setHeader("Cache-Control", "public, s-maxage=500");
		return res.status(200).json(data);
	} else {
		return res.status(405);
	}
}

export interface Data {
	total: number;
	achieved: number;
}

export async function getAchievementProgress(id: string) {
	const cacheKey = `achievement-${id}`;
	let data = (await kv.get(cacheKey)) as Data | null;
	if (data === null) {
		try {
			const url = `https://steamcommunity.com/profiles/76561198043214302/stats/${id}/?xml=1`;
			const text = await fetch(url).then((res) => res.text());
			const xml = parser.parse(text);
			let total = 0;
			let achieved = 0;
			if (xml.playerstats.achievements) {
				for (const achievement of xml.playerstats.achievements.achievement) {
					total++;
					if (achievement.unlockTimestamp != null) {
						achieved++;
					}
				}
			}
			data = {
				total,
				achieved,
			};
			await kv.set(cacheKey, data, {
				ex: 600,
			});
		} catch (e) {
			await kv.set(cacheKey, null, {
				ex: 600,
			});
			console.error(e);
			return null;
		}
	}
	return data;
}
