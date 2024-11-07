import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "redisClient";

const spotify = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET
);

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const songData = await getSongData(req.query.id as string);
		res.setHeader("Cache-Control", "public, s-maxage=5000");
		return res.status(200).json(songData);
	} else {
		return res.status(405);
	}
}

export async function getSongData(id: string) {
	const client = await getClient();
	let song = JSON.parse(await client.get("spotifyResult")) as Track | null;
	if (song === null || id !== song.id) {
		try {
			const result = await spotify.tracks.get(id);
			await client.set("spotifyResult", JSON.stringify(result));
			song = result;
		} catch (e) {
			await client.set("spotifyResult", null, {
				EX: 600,
			});
			console.error(e);
			return null;
		}
	}
	return song;
}
