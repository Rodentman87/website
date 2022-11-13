import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge",
};

const key = crypto.subtle.importKey(
	"raw",
	new TextEncoder().encode(process.env.SIGNING_SECRET),
	{ name: "HMAC", hash: { name: "SHA-256" } },
	false,
	["sign"]
);

function toHex(arrayBuffer: ArrayBuffer) {
	return Array.prototype.map
		.call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, "0"))
		.join("");
}

export default async function (req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const token = searchParams.get("token");

		const title = searchParams.get("title")?.slice(0, 100);

		const description = searchParams.get("description")?.slice(0, 200);

		const badgeLeft = searchParams.get("badgeLeft")?.slice(0, 100);
		const badgeRight = searchParams.get("badgeRight")?.slice(0, 100);

		const verifyToken = toHex(
			await crypto.subtle.sign(
				"HMAC",
				await key,
				new TextEncoder().encode(
					JSON.stringify({ title, description, badgeLeft, badgeRight })
				)
			)
		);

		if (token !== verifyToken) {
			return new Response("Invalid token.", { status: 401 });
		}

		return new ImageResponse(
			(
				<div
					style={{
						backgroundColor: "#fdf6e3",
						backgroundSize: "150px 150px",
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						flexWrap: "nowrap",
						position: "relative",
					}}
				>
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							flexDirection: "row",
						}}
					>
						<img
							src="https://www.likesdinosaurs.com/maisy.png"
							alt="Maisy Dinosaur"
							width="250"
							height="250"
						/>
					</div>
					<div
						style={{
							fontSize: 60,
							fontStyle: "normal",
							letterSpacing: "-0.025em",
							color: "black",
							marginTop: 8,
							padding: "0 120px",
							lineHeight: 1.4,
							whiteSpace: "pre-wrap",
						}}
					>
						{title}
					</div>
					<div
						style={{
							fontSize: 36,
							fontStyle: "normal",
							letterSpacing: "-0.025em",
							color: "rgb(104, 104, 104)",
							marginTop: 8,
							padding: "0 120px",
							lineHeight: 1.4,
							whiteSpace: "pre-wrap",
						}}
					>
						{description}
					</div>
					{badgeLeft && (
						<div
							style={{
								fontSize: 24,
								fontStyle: "normal",
								display: "flex",
								position: "absolute",
								bottom: 50,
								right: 50,
								borderRadius: 8,
								overflow: "hidden",
								border: "2px solid gold",
							}}
						>
							<span
								style={{
									backgroundColor: "#eee8d5",
									paddingLeft: 8,
									paddingRight: 8,
								}}
							>
								{badgeLeft}
							</span>
							<span
								style={{
									paddingLeft: 8,
									paddingRight: 8,
								}}
							>
								{badgeRight}
							</span>
						</div>
					)}
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		);
	} catch (e: any) {
		console.log(`${e.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}
