import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import Footer from "./footer";
import styles from "./layout.module.css";

export const name = "Maisy Dinosaur";
export const siteTitle = "Dinos are kinda cool";

export default function Layout({
	children,
	home,
}: {
	children: any;
	home?: any;
}) {
	return (
		<div className="max-w-full md:max-w-[45rem] px-4 mx-auto mb-24 mt-12">
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="og:color" content="#FDF6E3" />
			</Head>
			<header className={home ? styles.header : styles.headerPost}>
				{home ? (
					<>
						<motion.img
							layoutId="headersvg"
							src="/maisy-mask.jpg"
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
							<motion.img
								layoutId="headersvg"
								src="/maisy-mask.jpg"
								className={`${styles.headerImage} ${utilStyles.borderCircle}`}
								alt={name}
								width={108}
								height={108}
							/>
						</Link>
						<motion.h2 layoutId="headername" className={utilStyles.headingLg}>
							<Link href="/" className={utilStyles.colorInherit}>
								{name}
							</Link>
						</motion.h2>
					</>
				)}
			</header>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">← Back to home</Link>
				</div>
			)}
			<Footer />
		</div>
	);
}
