import Layout from "@components/layout";
import { createHmac } from "crypto";
import { motion, useReducedMotion } from "framer-motion";
import { readdir } from "fs/promises";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

type PageProps = {
	title: string;
	description: string;
	token: string;
	options: string;
	pageData: {
		id: string;
		title: string;
		description: string;
		number: number;
	}[];
};

const item = {
	visible: ({ i, shouldReduceMotion }) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.2,
		},
	}),
	hidden: ({ i, shouldReduceMotion }) =>
		shouldReduceMotion
			? {
					opacity: 0,
			  }
			: { opacity: 0, x: -100 },
};

export default function CyclesPage({
	title,
	description,
	token,
	options,
	pageData,
}: PageProps) {
	const shouldReduceMotion = useReducedMotion();

	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);
	params.append("token", token);
	params.append("options", options);

	return (
		<Layout centeredHeader>
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
			<div className="flex flex-row justify-between">
				<motion.h1 layoutId="cycles-title" className="text-3xl">
					Cycles
				</motion.h1>
			</div>
			<p>
				Cycles is a series of loosely connected short stories set in a universe
				where each planet has a unique, naturally occurring event that marks the
				start of a new year.
			</p>
			<motion.ul
				className="list-none flex flex-col gap-2 p-0"
				initial="hidden"
				animate="visible"
			>
				{pageData.map(({ id, title, description }, i) => (
					<motion.li
						className="flex flex-col gap-2 p-0"
						key={id}
						variants={item}
						custom={{ i, shouldReduceMotion }}
					>
						<Link href={`/cycles/${id}`} className="text-black no-underline">
							<motion.div
								className="p-2 shadow-sm rounded-md bg-gray-100 hover:shadow-md transition-shadow"
								initial="hidden"
								animate="visible"
								whileHover="hovered"
								layoutId={`title-${id}`}
							>
								{title}
								<div>{description}</div>
							</motion.div>
						</Link>
					</motion.li>
				))}
			</motion.ul>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const ids = await (await readdir(process.cwd() + "/src/pages/cycles"))
		.filter((file) => file.endsWith(".mdx"))
		.map((file) => file.replace(/\..*?$/, ""));

	const pageData = await Promise.all(
		ids.map(async (id) => {
			const page = await import(`./${id}.mdx`);
			return {
				id,
				title: page.meta.title,
				description: page.meta.description,
				number: page.meta.number,
			};
		})
	);

	pageData.sort((a, b) => a.number - b.number);

	const title = "Cycles";
	const description = "A journal";
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
			pageData,
		},
	};
};
