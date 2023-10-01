import { NextApiRequest, NextApiResponse } from "next";

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
		if (!cachedStatusResult) {
			const res = await fetch(
				"https://api.statusbadges.me/presence/152566937442975744"
			);
			const body = (await res.json()) as StatusResult;
			cachedStatusResult = body;
			setTimeout(() => {
				cachedStatusResult = null;
			}, 2000);
		}
		const statusResult = cachedStatusResult;
		const spotifyActivity = statusResult.activities.find(
			(activity) => activity.type === 2
		);
		if (!spotifyActivity) return null;
		res.setHeader("Cache-Control", "public, s-maxage=5");
		return res.status(200).json(spotifyActivity);
	} else {
		return res.status(405);
	}
}
