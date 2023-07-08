import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const url = new URL("http://likesdinosaurs.com" + req.url);
	const unlocked = url.searchParams.get("unlocked");
	const total = url.searchParams.get("total");

	if (!unlocked || !total) {
		throw Error('Missing "unlocked" or "total" param.');
	}

	const cookie = serialize("squareData", `${unlocked}.${total}`, {
		path: "/",
		sameSite: "none",
		secure: true,
	});

	res.setHeader("Set-Cookie", cookie);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Cache-Control", "max-age=0, s-maxage=0");

	return res.status(200).json({ success: true });
}
