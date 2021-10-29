import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SocialIcon } from "react-social-icons";

const name = "Rodentman87";
export const siteTitle = "Dinos are kinda cool";

const item = {
	visible: ({ i, shouldReduceMotion }) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.1,
		},
	}),
	hidden: ({ i, shouldReduceMotion }) =>
		shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -50 },
};

export default function Layout({
	children,
	home,
}: {
	children: any;
	home?: any;
}) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<div className={styles.container}>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Maisy's personal website." />
				<meta property="og:image" content={`/craig.svg`} />
				<meta name="og:title" content={siteTitle} />
				<meta name="og:color" content="#FDF6E3" />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<header className={home ? styles.header : styles.headerPost}>
				{home ? (
					<>
						<motion.img
							layoutId="headersvg"
							src="/craig.svg"
							className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
							alt={name}
							width={144}
							height={144}
						/>
						<motion.h1 layoutId="headername" className={utilStyles.heading2Xl}>
							{name}
						</motion.h1>
					</>
				) : (
					<>
						<Link href="/">
							<a>
								<motion.img
									layoutId="headersvg"
									src="/craig.svg"
									className={`${styles.headerImage} ${utilStyles.borderCircle}`}
									alt={name}
									width={108}
									height={108}
								/>
							</a>
						</Link>
						<motion.h2 layoutId="headername" className={utilStyles.headingLg}>
							<Link href="/">
								<a className={utilStyles.colorInherit}>{name}</a>
							</Link>
						</motion.h2>
					</>
				)}
			</header>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">
						<a>← Back to home</a>
					</Link>
				</div>
			)}
			<footer>
				<motion.div
					className={styles.footer}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={item} custom={{ i: 0, shouldReduceMotion }}>
						<SocialIcon url="https://twitter.com/rodentman87" />
					</motion.div>
					<motion.div variants={item} custom={{ i: 1, shouldReduceMotion }}>
						<SocialIcon url="https://github.com/Rodentman87" />
					</motion.div>
					<motion.div variants={item} custom={{ i: 2, shouldReduceMotion }}>
						<SocialIcon url="mailto:maisy@likesdinosaurs.com" />
					</motion.div>
					<motion.div variants={item} custom={{ i: 3, shouldReduceMotion }}>
						<SocialIcon
							network="discord"
							bgColor="#5865F2"
							url="https://discord.likesdinosaurs.com"
						/>
					</motion.div>
				</motion.div>
			</footer>
		</div>
	);
}
