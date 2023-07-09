import { NextApiRequest, NextApiResponse } from "next";

let cachedResult = null;

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		if (cachedResult) return res.status(200).json(cachedResult);

		const issLocation = (await (
			await fetch("http://api.open-notify.org/iss-now.json")
		).json()) as { iss_position: { latitude: string; longitude: string } };

		cachedResult = issLocation.iss_position;
		setTimeout(() => {
			cachedResult = null;
		}, 1000 * 5);
		return res.status(200).json(cachedResult);
	} else {
		return res.status(405);
	}
}
