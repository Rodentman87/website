import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import Footer from "./footer";
import { name } from "./layout";
import styles from "./layout.module.css";

export default function LessonLayout({
	children,
	course,
}: {
	children: any;
	course: string;
}) {
	return (
		<div className={styles.container}>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="og:color" content="#FDF6E3" />
			</Head>
			<header className={styles.headerPost}>
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
			</header>
			<div>
				<Link href={`/lessons/${course}`}>← Back to course</Link>
			</div>
			<main>{children}</main>
			<div className={styles.backToHome}>
				<Link href={`/lessons/${course}`}>← Back to course</Link>
			</div>
			<Footer />
		</div>
	);
}
