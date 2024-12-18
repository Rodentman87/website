import clsx from "clsx";
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import { Howl } from "howler";
import { Achievement } from "modules/achievements/AchievementStore";
import { AchievementRarity } from "modules/achievements/achievementList";
import { useOnAchievment } from "modules/achievements/hooks/useOnAchievment";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { WavyRainbowText } from "./RainbowText";

const confettiPop = new Howl({
	src: ["/pop.mp3"],
	preload: true,
});

const shwoop = new Howl({
	src: ["/Shwoooooop.mp3"],
	preload: true,
});

const achievementGetBodyVariants = (rarity: AchievementRarity) => ({
	hidden: {
		y: -100,
		transition: {
			when: "afterChildren",
			delay: 0.5,
		},
	},
	shown: {
		y: 0,
		transition: {
			when: "beforeChildren",
			duration: rarity >= AchievementRarity.EPIC ? 1 : 0.5,
		},
	},
});

const achievementTextVariants = (rarity: AchievementRarity) => ({
	hidden: {
		maxWidth: 0,
		marginRight: 0,
		transition: {
			duration: 0.75,
		},
	},
	shown: {
		maxWidth: "400px",
		marginRight: "1rem",
		transition: {
			duration: rarity >= AchievementRarity.EPIC ? 1.25 : 0.75,
		},
	},
});

const shimmerVariants = (rarity: AchievementRarity) => ({
	hidden: {
		x: "-100%",
		transition: {
			duration: 0.8,
		},
	},
	shown: {
		x: rarity >= AchievementRarity.UNCOMMON ? "650%" : "-100%",
		transition: {
			duration: 0.8,
			delay: rarity >= AchievementRarity.UNCOMMON ? 1 : 0.5,
		},
	},
});

export const AchievementGetDisplay: React.FC = () => {
	const [toBeDisplayed, setAchievementsToBeDisplayed] = React.useState<{
		current: Achievement | null;
		queue: Achievement[];
	}>({
		current: null,
		queue: [],
	});

	const onAchievementGet = useCallback(
		(achievement: Achievement) => {
			console.log("queueing achievement for display", achievement);
			setAchievementsToBeDisplayed((prev) => {
				if (prev.current === null) {
					return {
						current: achievement,
						queue: [],
					};
				} else {
					return {
						current: prev.current,
						queue: [...prev.queue, achievement],
					};
				}
			});
		},
		[setAchievementsToBeDisplayed]
	);

	useOnAchievment(onAchievementGet);

	return (
		<div
			className="fixed top-0 left-0 flex flex-row justify-center w-screen pointer-events-none"
			style={{ zIndex: 100000 }}
		>
			<div className="flex flex-col gap-2 pt-2">
				<AnimatePresence mode="wait">
					{toBeDisplayed.current && (
						<SingleAchievement
							key={toBeDisplayed.current.id}
							achievement={toBeDisplayed.current}
							clearAchievement={() => {
								setAchievementsToBeDisplayed((prev) => {
									if (prev.queue.length === 0) {
										return {
											current: null,
											queue: [],
										};
									} else {
										return {
											current: prev.queue[0],
											queue: prev.queue.slice(1),
										};
									}
								});
							}}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

interface AnimationState {
	shouldShow: boolean;
	showConfetti: boolean;
	showSideConfetti: boolean;
	confettiPalette: string[] | undefined;
	primaryColorRGB: string;
	secondaryColorRGB: string;
}

const SingleAchievement: React.FC<{
	achievement: Achievement;
	clearAchievement: () => void;
}> = ({ achievement, clearAchievement }) => {
	const [animationState, setAnimationState] = React.useState<AnimationState>({
		shouldShow: false,
		showConfetti: false,
		showSideConfetti: false,
		confettiPalette: undefined,
		primaryColorRGB: "255 255 255",
		secondaryColorRGB: "255 255 255",
	});

	const filteredClasses = useMemo(() => {
		const baseClasses =
			"relative flex flex-row p-2 text-black bg-white border-2 border-solid rounded-full bg-opacity-60 backdrop-blur-lg overflow-clip border-opacity-40";
		if (achievement.filterAchievementClasses === undefined) return baseClasses;
		const filters = achievement.filterAchievementClasses.split(" ");
		return baseClasses
			.split(" ")
			.filter((c) => !filters.includes(c))
			.join(" ");
	}, [achievement.filterAchievementClasses]);

	return (
		<>
			{animationState.showConfetti && (
				<div className="fixed top-0 left-1/2">
					<ConfettiExplosion
						zIndex={500}
						force={0.2}
						colors={animationState.confettiPalette}
						width={window.visualViewport.width}
						duration={2000}
						particleCount={100}
					/>
				</div>
			)}
			{animationState.showSideConfetti && (
				<>
					<div className="fixed top-0 left-0">
						<ConfettiExplosion
							zIndex={500}
							force={0.8}
							colors={animationState.confettiPalette}
							width={window.visualViewport.width}
							duration={2000}
							particleCount={100}
						/>
					</div>
					<div className="fixed top-0 right-0">
						<ConfettiExplosion
							zIndex={500}
							force={0.8}
							colors={animationState.confettiPalette}
							width={window.visualViewport.width}
							duration={2000}
							particleCount={100}
						/>
					</div>
				</>
			)}
			<motion.div
				key={achievement.id}
				style={{
					zIndex: 501,
					borderColor: `rgb(${animationState.primaryColorRGB})`,
				}}
				className={clsx(filteredClasses, achievement.customAchievementClasses)}
				variants={achievementGetBodyVariants(achievement.rarity)}
				initial="hidden"
				animate={animationState.shouldShow ? "shown" : false}
				onAnimationComplete={(definition) => {
					if (definition === "shown") {
						if (achievement.rarity >= AchievementRarity.RARE) {
							setAnimationState((old) => ({ ...old, showConfetti: true }));
							confettiPop.play();
						}
						if (achievement.rarity >= AchievementRarity.EPIC) {
							setTimeout(() => {
								setAnimationState((old) => ({
									...old,
									showSideConfetti: true,
								}));
								confettiPop.play();
							}, 250);
						}
						setTimeout(() => {
							clearAchievement();
							setAnimationState((old) => ({
								...old,
								showConfetti: false,
								showSideConfetti: false,
							}));
						}, 3500);
					}
				}}
				exit="hidden"
			>
				<motion.div
					style={{
						zIndex: 502,
					}}
					className="absolute left-0 w-32 opacity-50 not-sr-only h-36 -top-8 bg-gradient-to-br from-transparent to-transparent via-white from-30% to-70% via-50%"
					variants={shimmerVariants(achievement.rarity)}
				/>
				<div className="relative">
					<Image
						unoptimized
						className="absolute top-0 left-0 -z-10 blur-md saturate-200"
						src={achievement.icon}
						alt={achievement.name}
						width={54}
						height={54}
					/>
					<Image
						unoptimized
						className="z-10"
						src={achievement.icon}
						alt={achievement.name}
						width={54}
						height={54}
						onLoad={async (e) => {
							const colors = await extractColors(
								achievement.icon,
								e.target as HTMLImageElement
							);
							const bestColors = getBestColors(colors, Color("#FFFFFF"));

							const id = shwoop.play();
							if (achievement.rarity >= AchievementRarity.EPIC) {
								shwoop.rate(0.9, id);
							}
							setAnimationState((old) => ({
								...old,
								shouldShow: true,
								confettiPalette: colors.map((c) => c.hex()),
								primaryColorRGB: `${bestColors.primary.red()} ${bestColors.primary.green()} ${bestColors.primary.blue()}`,
								secondaryColorRGB: `${bestColors.secondary.red()} ${bestColors.secondary.green()} ${bestColors.secondary.blue()}`,
							}));
						}}
					/>
				</div>
				<motion.div
					variants={achievementTextVariants(achievement.rarity)}
					className="flex flex-col justify-between overflow-clip"
				>
					<div className="flex flex-row items-center justify-between gap-2 pl-2">
						<h2 className="font-bold whitespace-nowrap">
							{achievement.rarity === AchievementRarity.LEGENDARY ? (
								<WavyRainbowText
									size={1}
									text={achievement.name}
									gradientColors={
										animationState.confettiPalette &&
										animationState.confettiPalette.slice(0, 6)
									}
								/>
							) : (
								achievement.name
							)}
						</h2>
						<span
							style={{
								color: `rgb(${animationState.secondaryColorRGB})`,
							}}
							className="text-xl font-extrabold"
						>
							+{achievement.score}
						</span>
					</div>
					<p className="pl-2 m-0 text-sm whitespace-nowrap">
						{achievement.description}
					</p>
				</motion.div>
			</motion.div>
		</>
	);
};
