import Head from "next/head";
import { BsPinAngleFill } from "react-icons/bs";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { motion } from "framer-motion";

export default function FirstPost({ postData }) {
	return (
		<Layout>
			<Head>
				<title>{postData.title}</title>
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/base16/solarized-light.min.css"
				></link>
			</Head>
			<article>
				<motion.h1
					layoutId={`title-${postData.id}`}
					className={utilStyles.headingXl}
				>
					{postData.title}
				</motion.h1>

				<div className={utilStyles.lightText}>
					<Date dateString={postData.date} />
					{postData.pinned == true ? (
						<motion.div
							layoutId={`pin-${postData.id}`}
							style={{ display: "inline-block" }}
						>
							<BsPinAngleFill color="#60b53c" style={{ marginLeft: 10 }} />
						</motion.div>
					) : null}
				</div>
				<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
	return {
		props: {
			postData,
		},
	};
}
