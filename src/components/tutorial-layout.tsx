import Head from "next/head";
import Layout from "./layout";
import DateDisplay from "./date";
import utilStyles from "../styles/utils.module.css";
import React from "react";

interface Props {
	children: React.ReactNode;
	title: string;
	description: string;
}

export const TutorialLayout: React.FC<Props> = ({
	children,
	title,
	description,
}) => {
	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);

	return (
		<Layout>
			<Head>
				<title>{title}</title>
				<meta name="og:title" content={title} />
				<meta name="og:description" content={description} />
				<meta name="og:type" content="article" />
				<meta
					name="og:image"
					content={
						"https://likesdinosaurs.com/api/post-image?" + params.toString()
					}
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
					content={
						"https://likesdinosaurs.com/api/post-image?" + params.toString()
					}
				/>
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/base16/solarized-light.min.css"
				/>
			</Head>
			<article>
				<h1 className={utilStyles.headingXl}>{title}</h1>

				<div className={utilStyles.lightText}>{description}</div>
				{children}
			</article>
		</Layout>
	);
};
