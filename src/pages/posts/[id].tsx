import Head from "next/head";
import { BsPinAngleFill } from "react-icons/bs";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import DateDisplay from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { motion } from "framer-motion";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function FirstPost({ content, metadata }) {
	const params = new URLSearchParams();
	params.append("title", metadata.title.replace(/\?$/, ""));
	params.append("description", metadata.description);
	if (metadata.title.endsWith("?")) {
		params.append("questionMark", "true");
	}

	return (
		<Layout>
			<Head>
				<title>{metadata.title}</title>
				<meta name="og:title" content={metadata.title} />
				<meta name="og:description" content={metadata.description} />
				<meta name="og:type" content="article" />
				<meta
					name="og:published_time"
					content={new Date(metadata.date).toISOString()}
				/>
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
				<meta name="twitter:title" content={metadata.title} />
				<meta name="twitter:description" content={metadata.description} />
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
				<motion.h1
					layoutId={`title-${metadata.id}`}
					className={utilStyles.headingXl}
				>
					{metadata.title}
				</motion.h1>

				<div className={utilStyles.lightText}>
					{metadata.pinned == true ? (
						<motion.div
							layoutId={`pin-${metadata.id}`}
							style={{ display: "inline-block" }}
						>
							<BsPinAngleFill color="#60b53c" style={{ marginLeft: 10 }} />
						</motion.div>
					) : null}
					<DateDisplay dateString={metadata.date} /> •{" "}
					<span>{metadata.readtime}</span>
				</div>
				<MDXRemote {...content} components={{ DateDisplay }} />
			</article>
		</Layout>
	);
}

export async function getStaticPaths() {
	// Return a list of possible value for id
	const paths = getAllPostIds();
	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	// Fetch necessary data for the blog post using params.id
	const postData = await getPostData(params.id);

	const serialized = await serialize(postData.content, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [remarkToc, remarkGfm],
			rehypePlugins: [rehypeHighlight],
		},
	});

	return {
		props: {
			content: serialized,
			metadata: {
				...postData.metadata,
			},
		},
	};
}
