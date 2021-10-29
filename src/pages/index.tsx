import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { BsPinAngleFill } from "react-icons/bs";
import Date from "../components/date";
import { getSortedPostsData } from "../../lib/posts";
import { motion, useReducedMotion } from "framer-motion";

export async function getStaticProps() {
	const allPostsData = getSortedPostsData();
	return {
		props: {
			allPostsData,
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

export default function Home({ allPostsData }) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p>Hi, my name is Maisy and I do stuff sometimes</p>
			</section>
			<section>
				<h2>Blog</h2>
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
								<Link href={`/posts/${id}`}>
									<a>{title}</a>
								</Link>
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
								<Date dateString={date} />
							</small>
						</motion.li>
					))}
				</motion.ul>
			</section>
		</Layout>
	);
}
