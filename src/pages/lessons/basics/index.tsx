import Layout from "@components/layout";
import { createHmac } from "crypto";
import { motion, useReducedMotion } from "framer-motion";
import { readdir } from "fs/promises";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import utilStyles from "../../../styles/utils.module.css";

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

type PageProps = {
	lessons: { id: string; title: string; description: string }[];
	title: string;
	description: string;
	token: string;
};

export default function LessonList({
	lessons,
	title,
	description,
	token,
}: PageProps) {
	const shouldReduceMotion = useReducedMotion();

	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);
	params.append("token", token);

	return (
		<Layout>
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
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/base16/solarized-light.min.css"
				/>
			</Head>
			<h1>Lessons</h1>
			<br />
			<motion.ul className={utilStyles.list} initial="hidden" animate="visible">
				{lessons.map(({ id, title, description }, i) => (
					<motion.li
						className={utilStyles.listItem}
						key={id}
						variants={item}
						custom={{ i, shouldReduceMotion }}
					>
						<motion.div
							initial="hidden"
							animate="visible"
							whileHover="hovered"
							layoutId={`title-${id}`}
						>
							<Link href={`/posts/${id}`}>{title}</Link>
							<div>{description}</div>
						</motion.div>
					</motion.li>
				))}
			</motion.ul>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const ids = await (await readdir(process.cwd() + "/src/pages/lessons/basics"))
		.filter((file) => !file.startsWith("[") && !file.startsWith("index"))
		.map((file) => file.replace(/\..*?$/, ""));

	const pageData = await Promise.all(
		ids.map(async (id) => {
			if (id === "index") return;
			const page = await import(`./${id}.mdx`);
			return {
				id,
				title: page.meta.title,
				description: page.meta.description,
			};
		})
	);

	const title = "Basics";
	const description = "An introduction to the basics of programming";
	const hmac = createHmac("sha256", process.env.SIGNING_SECRET);
	hmac.update(
		JSON.stringify({
			title,
			description,
		})
	);
	const token = hmac.digest("hex");

	return {
		props: {
			title,
			description,
			token,
			lessons: pageData,
		},
	};
};
