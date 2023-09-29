import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

const spotify = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET
);

let cachedStatusResult: StatusResult | null = null;

interface StatusResult {
	status: string;
	guild_id: string;
	client_status: {
		desktop?: string;
		mobile?: string;
		web?: string;
	};
	activities: {
		type: number;
		name: string;
		url?: string;
		created_at: number;
		timestamps?: {
			start: number;
			end?: number;
		};
		application_id?: string;
		details?: string;
		state?: string;
		emoji?: {
			name?: string;
			id?: string;
			animated?: boolean;
		};
		party?: {
			id?: string;
			size?: [number, number];
		};
		assets?: {
			large_image?: string;
			large_text?: string;
			small_image?: string;
			small_text?: string;
		};
		sync_id?: string;
	}[];
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const songData = await getSongData();
		res.setHeader("Cache-Control", "public, s-maxage=2");
		return res.status(200).json(songData);
	} else {
		return res.status(405);
	}
}

export async function getSongData() {
	if (!cachedStatusResult) {
		const res = await fetch(
			"https://api.statusbadges.me/presence/152566937442975744"
		);
		const body = (await res.json()) as StatusResult;
		cachedStatusResult = body;
	}
	const statusResult = cachedStatusResult;
	const spotifyActivity = statusResult.activities.find(
		(activity) => activity.type === 2
	);
	if (!spotifyActivity) return null;
	let song = await kv.get("spotifyResult");
	if (spotifyActivity.sync_id !== (await kv.get("spotifyResultId"))) {
		await kv.set("spotifyResultId", spotifyActivity.sync_id);
		try {
			const result = await spotify.tracks.get(spotifyActivity.sync_id);
			await kv.set("spotifyResult", result);
			song = result;
		} catch (e) {
			await kv.set("spotifyResult", null);
			console.error(e);
			return null;
		}
	}
	if (song === null) return null;
	return {
		start: spotifyActivity.timestamps.start,
		end: spotifyActivity.timestamps.end,
		song: song,
	};
}
