import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

const spotify = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET
);

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const songData = await getSongData(req.query.id as string);
		res.setHeader("Cache-Control", "public, s-maxage=500");
		return res.status(200).json(songData);
	} else {
		return res.status(405);
	}
}

export async function getSongData(id: string) {
	let song = (await kv.get("spotifyResult")) as Track | null;
	if (song === null || id !== song.id) {
		try {
			const result = await spotify.tracks.get(id);
			await kv.set("spotifyResult", result);
			song = result;
		} catch (e) {
			await kv.set("spotifyResult", null);
			console.error(e);
			return null;
		}
	}
	return song;
}
