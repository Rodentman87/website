import clsx from "clsx";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Portal } from "react-portal";
import utilStyles from "../styles/utils.module.css";
import Footer from "./footer";
import styles from "./layout.module.css";

export const name = "Maisy Dinosaur";
export const siteTitle = "Dinos are kinda cool";

export default function Layout({
	children,
	centeredHeader,
	hideBackToHome,
	backButtonText,
	backButtonLink,
	allowLmao,
}: {
	children: any;
	centeredHeader?: boolean;
	hideBackToHome?: boolean;
	backButtonText?: string;
	backButtonLink?: string;
	allowLmao?: boolean;
}) {
	const [lmao, setLmao] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="max-w-full md:max-w-[45rem] px-4 mx-auto mb-24 mt-12">
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="og:color" content="#FDF6E3" />
			</Head>
			<header className={centeredHeader ? styles.header : styles.headerPost}>
				{isMounted && allowLmao && (
					<Portal>
						<div
							onClick={(e) => e.stopPropagation()}
							className={clsx(
								"fixed top-0 left-0 z-10 w-screen h-screen transition-all duration-300 pointer-events-none",
								{
									"backdrop-blur-none": !lmao,
									"backdrop-blur-sm": lmao,
								}
							)}
						></div>
					</Portal>
				)}
				{centeredHeader ? (
					<>
						<motion.div
							onClick={() => setLmao(!lmao)}
							layoutId="headersvg"
							className={clsx(
								styles.headerHomeImage,
								utilStyles.borderCircle,
								"z-20",
								{ "cursor-pointer": allowLmao }
							)}
						>
							<Image
								alt={name}
								src={
									lmao && allowLmao
										? "/maisy-no-glasses.png"
										: "/maisy-mask.jpg"
								}
								width={144}
								height={144}
							/>
						</motion.div>
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
			{!hideBackToHome && (
				<div className={styles.backToHome}>
					<Link href={backButtonLink ?? "/"}>
						← {backButtonText ?? "Back to home"}
					</Link>
				</div>
			)}
			<Footer />
		</div>
	);
}
