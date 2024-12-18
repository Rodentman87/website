import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { value2: v, value3: value } = req.query;

		const [state, token] = (v as string).split("-");

		if (token !== process.env.DIE_ROLL_TOKEN) {
			return res
				.status(401)
				.json({ status: "error", message: "Invalid token" });
		}

		console.log(state, value);

		await fetch(
			`https://api.lanyard.rest/v1/users/${process.env.USER_ID}/kv/dieroll`,
			{
				method: "PUT",
				headers: {
					Authorization: process.env.LANYARD_TOKEN,
				},
				body: JSON.stringify({
					state,
					value: Number(value),
					time: Date.now(),
				}),
			}
		);

		res.status(200).json({ status: "ok" });
	} else {
		return res.status(405);
	}
}
