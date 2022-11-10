import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge",
};

export default async function (req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const hasTitle = searchParams.has("title");
		const title = hasTitle
			? searchParams.get("title")?.slice(0, 100)
			: "My default title";

		const hasDescription = searchParams.has("description");
		const description = hasTitle
			? searchParams.get("description")?.slice(0, 100)
			: "My default description";

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
