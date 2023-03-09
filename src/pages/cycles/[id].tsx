import Layout from "@components/layout";
import { createHmac } from "crypto";
import { readdir } from "fs/promises";
import { GetStaticProps } from "next";
import Head from "next/head";
import destruction from "./destruction.mdx";
import prologue from "./prologue.mdx";

const pages = {
	"prologue.mdx": prologue,
	"destruction.mdx": destruction,
};

type PageProps = {
	title: string;
	description: string;
	options: string;
	token: string;
	fileName: string;
};

export default function Post({
	title,
	description,
	options,
	token,
	fileName,
}: PageProps) {
	const Component = pages[fileName];

	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);
	params.append("options", options);
	params.append("token", token);

	return (
		<Layout
			centeredHeader
			backButtonLink="/cycles"
			backButtonText="Back to index"
		>
			<Head>
				<title>{title}</title>
				<meta name="og:title" content={title} />
				<meta name="og:description" content={description} />
				<meta name="og:type" content="article" />
				<meta
					name="og:image"
					content={"/api/post-image?" + params.toString()}
				/>
				<meta name="og:image:width" content="1200" />
				<meta name="og:image:height" content="630" />
				<meta name="og:author:first_name" content="Maisy" />
				<meta name="og:author:last_name" content="Dinosaur" />
				<meta name="og:author:username" content="rodentman87" />
				<meta name="og:author:gender" content="female" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@rodentman87" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta
					name="twitter:image"
					content={"/api/post-image?" + params.toString()}
				/>
				<meta name="theme-color" content="#000000" />
			</Head>
			<div className="indent-8 bg-yellow-50 px-4 pt-7 pb-1 rounded-lg">
				<Component />
			</div>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { id } = params;
	const page = await import(`./${id}.mdx`);
	const title = page.meta.title;
	const description = `Journal entry ${page.meta.number}`;
	const options = btoa(
		JSON.stringify({
			backgroundColor: "black",
			textColor: "white",
		})
	);
	const hmac = createHmac("sha256", process.env.SIGNING_SECRET);
	hmac.update(
		JSON.stringify({
			title,
			description,
			options,
		})
	);
	const token = hmac.digest("hex");

	return {
		props: {
			title,
			description,
			token,
			options,
			fileName: `${id}.mdx`,
		},
	};
};

export async function getStaticPaths() {
	// Return a list of possible value for id
	const paths = await (
		await readdir(process.cwd() + "/src/pages/cycles")
	)
		.filter((file) => file.endsWith(".mdx"))
		.map((file) => file.replace(/\..*?$/, ""))
		.map((file) => "/cycles/" + file);

	return {
		paths,
		fallback: false,
	};
}
