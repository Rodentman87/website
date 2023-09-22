import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const spotify = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET
);

let cachedResult = null;
let cachedSpotifyResult = null;
let cachedSpotifyResultId = null;

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
		return res.status(200).json(songData);
	} else {
		return res.status(405);
	}
}

export async function getSongData() {
	let statusResult = cachedResult;
	if (!statusResult) {
		const res = await fetch(
			"https://api.statusbadges.me/presence/152566937442975744"
		);
		const body = (await res.json()) as StatusResult;
		cachedResult = body;
		setTimeout(() => {
			cachedResult = null;
		}, 1000);
		statusResult = body;
	}
	const spotifyActivity = statusResult.activities.find(
		(activity) => activity.type === 2
	);
	if (!spotifyActivity) return null;
	if (spotifyActivity.sync_id !== cachedSpotifyResultId) {
		cachedSpotifyResult = await spotify.tracks.get(spotifyActivity.sync_id);
		cachedSpotifyResultId = spotifyActivity.sync_id;
	}
	const song = cachedSpotifyResult;
	return {
		start: spotifyActivity.timestamps.start,
		end: spotifyActivity.timestamps.end,
		song: song,
	};
}
