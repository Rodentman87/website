import { AudioAutoplayPrompt } from "@components/AudioAutoplayPrompt";
import { CyclesCard } from "@components/CyclesCard";
import { ProjectCard } from "@components/ProjectCard";
import { SpotifyStatus } from "@components/Spotify";
import { Square, SquareReveal } from "@components/Square";
import { createHmac } from "crypto";
import distanceFrom from "distance-from";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useAchievementStore } from "hooks/useAchievementStore";
import { useFancyEffects } from "hooks/useFancyEffect";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { getCyclesEntriesCount, getSortedPostsData } from "../../lib/posts";
import DateDisplay from "../components/date";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export async function getServerSideProps({ req }) {
	const allPostsData = getSortedPostsData();
	const cyclesEntriesCount = getCyclesEntriesCount();

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
			cyclesEntriesCount,
		},
	};
}

const item = {
	visible: ({ i }) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.2,
		},
	}),
	hidden: ({ shouldReduceMotion }) =>
		shouldReduceMotion
			? {
					opacity: 0,
			  }
			: { opacity: 0, x: -100 },
};

const pin = {
	visible: ({ i }) => ({
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
	hidden: ({ shouldReduceMotion }) =>
		shouldReduceMotion
			? {
					opacity: 0,
			  }
			: {
					x: 20,
					y: -20,
					opacity: 0,
			  },
	hovered: ({ shouldReduceMotion }) =>
		shouldReduceMotion
			? {}
			: {
					x: 5,
					y: -10,
					rotate: -45,
			  },
};

export default function Home({
	allPostsData,
	title,
	description,
	token,
	cyclesEntriesCount,
}) {
	const shouldReduceMotion = useReducedMotion();
	const [showFancy, setShowFancy] = useFancyEffects();
	const achievementStore = useAchievementStore();
	const [showSquare, setShowSquare] = useState(false);

	const params = new URLSearchParams();
	params.append("title", title);
	params.append("description", description);
	params.append("token", token);

	// Achievement related stuff
	useEffect(() => {
		if (showFancy) {
			setTimeout(
				() => achievementStore.markProgress("fancyEffects", true),
				1000
			);
		}
		const today = new Date();
		const month = today.getMonth();
		const day = today.getDate();
		if (month === 2 && day === 24) {
			achievementStore.markProgress("birthday", true);
		}
		if (month === 5) {
			achievementStore.markProgress("prideMonth", true);
		}
		if (today.getTime() < 1688337900000) {
			achievementStore.markProgress("timeTravel", true);
		}
		window["logIt"] = () => {
			console.log("🪵");
			achievementStore.markProgress("console", true);
		};
		fetch("/api/iss")
			.then((data) => data.json())
			.then((data) => {
				const iss = data as { latitude: number; longitude: number };
				const JSC = [29.5622, -95.0908];
				// @ts-expect-error I don't want to type this
				const distance: number = distanceFrom(JSC)
					.to([iss.latitude, iss.longitude])
					.in("mi");
				console.log("distance", distance);
				if (distance < 700) {
					achievementStore.markProgress("iss", true);
				}
			});
		// Check how many other tabs are open
		const myId = Math.random().toString();
		const channel = new BroadcastChannel("tab-count");
		let tabs = [myId];
		channel.onmessage = (e) => {
			if (e.data !== "echo") {
				tabs.push(e.data);
			}
		};
		channel.postMessage("echo");
		setTimeout(() => {
			console.log("tabs", tabs);
			if (tabs.length >= 5)
				achievementStore.markProgress("fiveTabs", true, true);
			channel.onmessage = (e) => {
				if (e.data === "echo") {
					console.log("sending", myId);
					channel.postMessage(myId);
				}
			};
		}, 1000);
		return () => {
			channel.close();
		};
	}, []);

	return (
		<Layout centeredHeader hideBackToHome allowLmao>
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
			<AudioAutoplayPrompt />
			{showSquare ? (
				<Square onHide={() => setShowSquare(false)} />
			) : (
				<SquareReveal onClick={() => setShowSquare(true)} />
			)}
			<div className="fixed bottom-2 left-2">
				<SpotifyStatus />
			</div>
			<section className="flex flex-col items-center justify-between text-xl md:flex-row">
				<p>Hi! My name is Maisy, and I do stuff sometimes.</p>
				<label className="text-sm">
					Enable fancy effects
					<input
						type="checkbox"
						className="ml-2"
						checked={showFancy}
						onChange={(e) => {
							setShowFancy(e.target.checked);
							window.location.reload();
						}}
					/>
				</label>
			</section>
			<section className="mb-4">
				<h2 className="mb-4">Courses </h2>
				<Link href={"lessons/basics"} className="no-underline">
					<motion.div
						whileHover={"hover"}
						whileTap={"default"}
						variants={{
							hover: {
								scale: shouldReduceMotion ? 1 : 1.05,
								rotate: shouldReduceMotion ? 0 : 1,
							},
							default: { scale: 1, rotate: 0 },
						}}
						className="relative flex flex-col gap-2 p-4 text-black transition-shadow rounded-md shadow-sm overflow-clip hover:shadow-md active:shadow-inner"
						style={{ backgroundColor: "#fdf6e3" }}
					>
						<motion.div
							className="absolute left-0 opacity-50 not-sr-only from-transparent to-transparent via-white bg-gradient-to-br h-36 -top-8 w-28"
							variants={{
								hover: { x: "650%", transition: { duration: 1 } },
							}}
							initial={{
								x: "-100%",
							}}
							animate="hover"
						/>
						<div className="flex flex-row items-center gap-2">
							<motion.h3
								layoutId="lesson-basics-title"
								className="text-xl font-bold md:text-2xl"
							>
								Programming: The Basics
							</motion.h3>
							<motion.span
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3, duration: 0.5 }}
								className="px-2 text-sm font-normal text-white bg-blue-500 rounded-full"
							>
								Beta
							</motion.span>
						</div>
						<div className="flex flex-col justify-between sm:flex-row">
							<p className="m-0">Lessons: 4</p>
							<p className="m-0">Estimated time to complete: 1 hour</p>
						</div>
					</motion.div>
				</Link>
			</section>
			<section className="mb-4">
				<h2 className="mb-4">Writing</h2>
				<Link href={"/cycles"} className="no-underline">
					<CyclesCard
						starLayers={4}
						starsPerLayer={60}
						cyclesEntriesCount={cyclesEntriesCount}
					/>
				</Link>
			</section>
			<section className="mb-4">
				<h2 className="mb-4">Projects</h2>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<LayoutGroup>
						<ProjectCard
							id="ksp-2-save-viewer"
							title="KSP 2 Save Viewer"
							description="A web app to view and edit KSP 2 save files."
							brandColor="#25282f"
							dark
							iconPath="/icons/ksp-2-save-viewer.svg"
							iconClassNames="text-white"
							link="https://ksp-2-save-viewer.likesdinosaurs.com/"
						/>
						<ProjectCard
							id="cardmaw"
							title="Colossal Cardmaw"
							description="Colossal Cardmaw allows you to look up and share Magic: The Gathering cards in Discord, allowing for new ways to build decks collaboratively."
							brandColor="#b39f6b"
							dark
							iconPath="/icons/cardmaw.png"
							iconClassNames="rounded-full overflow-hidden"
							link="https://www.discord.com/application-directory/956059320880103475"
						/>
						<ProjectCard
							id="slashasaurus"
							title="Slashasaurus"
							description="A framework for building Discord bots with well typed slash commands and a React-like API for using message components."
							brandColor="white"
							iconPath="/icons/slashy.png"
							link="https://www.npmjs.com/package/slashasaurus"
							cardClassNames="border border-gray-200"
						/>
						<ProjectCard
							id="dino-ql"
							title="DinoQL"
							description="My take on an alternative to GraphQL and REST."
							brandColor="#004f41"
							dark
							link="https://github.com/Rodentman87/dinoql"
						/>
					</LayoutGroup>
				</div>
			</section>
			<section>
				<h2 className="mb-4">Blog</h2>
				<motion.ul
					className={utilStyles.list}
					initial="hidden"
					whileInView="visible"
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
								whileInView="visible"
								whileHover="hovered"
								layoutId={`title-${id}`}
							>
								<Link href={`/posts/${id}`}>{title}</Link>
								{pinned == true ? (
									<motion.div
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
