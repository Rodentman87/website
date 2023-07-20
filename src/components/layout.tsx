import clsx from "clsx";
import { motion } from "framer-motion";
import { useAchievementStore } from "hooks/useAchievementStore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Portal } from "react-portal";
import utilStyles from "../styles/utils.module.css";
import { HandwrittenName } from "./HandwrittenName";
import Footer from "./footer";
import styles from "./layout.module.css";

export const firstName = "Maisy";
export const lastName = "Dinosaur";
export const name = firstName + " " + lastName;
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
	const [showHandwrittenName, setShowHandwrittenName] =
		useState(centeredHeader);
	const achievementStore = useAchievementStore();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onClickMyFace = () => {
		setLmao(!lmao);
		if (!lmao) {
			achievementStore.markProgress("glassesRemoved", 1);
		}
	};

	return (
		<div className="max-w-full md:max-w-[45rem] px-4 mx-auto mb-24 mt-12 overflow-clip sm:overflow-visible">
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
							onClick={onClickMyFace}
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
								priority
								src={
									lmao && allowLmao
										? "/maisy-no-glasses.png"
										: "/maisy-mask.jpg"
								}
								width={144}
								height={144}
							/>
						</motion.div>
						<motion.h1
							layoutId="headername"
							className={
								"font-black text-3xl sm:text-4xl md:text-5xl whitespace-nowrap"
							}
						>
							<motion.span
								className={clsx(
									"relative text-black transition-all duration-1000 inline-block",
									{
										"text-opacity-0": showHandwrittenName,
									}
								)}
								animate={
									showHandwrittenName
										? {
												width:
													typeof window !== "undefined" &&
													window.visualViewport.width > 768
														? 200
														: 150,
										  }
										: {}
								}
							>
								{firstName}
								{showHandwrittenName && (
									<HandwrittenName
										onAnimationDone={() =>
											setTimeout(() => setShowHandwrittenName(false), 1000)
										}
									/>
								)}
							</motion.span>{" "}
							{lastName}
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
