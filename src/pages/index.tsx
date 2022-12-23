import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { BsPinAngleFill } from "react-icons/bs";
import DateDisplay from "../components/date";
import { getSortedPostsData } from "../../lib/posts";
import { motion, useReducedMotion } from "framer-motion";
import { createHmac } from "crypto";

export async function getStaticProps() {
	const allPostsData = getSortedPostsData();

	const title = siteTitle;
	const description = "Maisy's homepage and blog";
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
			allPostsData,
			title,
			description,
			token,
		},
	};
}

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

const pin = {
	visible: ({ i, shouldReduceMotion }) => ({
		x: 0,
		y: 0,
		rotate: 0,
		opacity: 1,
		transition: {
			delay: i * 0.2 + 0.5,
			type: "spring",
			stiffness: 500,
		},
	}),
	hidden: ({ i, shouldReduceMotion }) =>
		shouldReduceMotion
			? {
					opacity: 0,
			  }
			: {
					x: 20,
					y: -20,
					opacity: 0,
			  },
	hovered: ({ i, shouldReduceMotion }) =>
		shouldReduceMotion
			? {}
			: {
					x: 5,
					y: -10,
					rotate: -45,
			  },
};

export default function Home({ allPostsData, title, description, token }) {
	const shouldReduceMotion = useReducedMotion();

	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);
	params.append("token", token);

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
				<meta name="og:title" content={siteTitle} />
				<meta name="og:description" content={description} />
				<meta name="twitter:site" content="@rodentman87" />
				<meta name="twitter:title" content={siteTitle} />
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
			</Head>
			<section className={utilStyles.headingMd}>
				<p>Hi, my name is Maisy and I do stuff sometimes</p>
			</section>
			<section>
				<h2 className="mb-4">Blog</h2>
				<motion.ul
					className={utilStyles.list}
					initial="hidden"
					animate="visible"
				>
					{allPostsData.map(({ id, date, title, pinned }, i) => (
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
								{pinned == true ? (
									<motion.div
										layoutId={`pin-${id}`}
										style={{ display: "inline-block" }}
										variants={pin}
										custom={{ i, shouldReduceMotion }}
									>
										<BsPinAngleFill
											color="#60b53c"
											style={{ marginLeft: 10 }}
										/>
									</motion.div>
								) : null}
							</motion.div>
							<small className={utilStyles.lightText}>
								<DateDisplay dateString={date} />
							</small>
						</motion.li>
					))}
				</motion.ul>
			</section>
		</Layout>
	);
}
