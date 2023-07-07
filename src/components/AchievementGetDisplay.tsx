import { Achievement } from "achievements/AchievementStore";
import { AnimatePresence, motion } from "framer-motion";
import { useOnAchievment } from "hooks/useOnAchievment";
import Image from "next/image";
import React, { useCallback } from "react";

const achievementGetBodyVariants = {
	hidden: {
		y: -100,
		gap: 0,
		transition: {
			when: "afterChildren",
			delay: 0.5,
		},
	},
	shown: {
		y: 0,
		gap: 2,
		transition: {
			when: "beforeChildren",
		},
	},
};

const achievementTextVariants = {
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
			duration: 0.75,
		},
	},
};

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
			className="fixed top-0 left-0 flex flex-row justify-center w-screen"
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

const SingleAchievement: React.FC<{
	achievement: Achievement;
	clearAchievement: () => void;
}> = ({ achievement, clearAchievement }) => {
	const [shouldShow, setShouldShow] = React.useState(false);

	return (
		<motion.div
			key={achievement.id}
			className="relative flex flex-row p-2 text-black bg-gray-300 border border-gray-400 border-solid rounded-full bg-opacity-40 backdrop-blur-md overflow-clip border-opacity-40"
			variants={achievementGetBodyVariants}
			initial="hidden"
			animate={shouldShow ? "shown" : "hidden"}
			onAnimationComplete={(definition) => {
				if (definition === "shown") {
					setTimeout(() => {
						clearAchievement();
					}, 2000);
				}
			}}
			exit="hidden"
		>
			<motion.div
				className="absolute left-0 w-32 opacity-50 not-sr-only from-transparent to-transparent via-white bg-gradient-to-br h-36 -top-8"
				variants={{
					shown: {
						x: "650%",
						transition: { duration: 0.8, delay: 0.5 },
					},
				}}
				initial={{
					x: "-100%",
				}}
			/>
			<div className="relative">
				<Image
					className="absolute top-0 left-0 -z-10 blur-md saturate-200"
					src={achievement.icon}
					alt={achievement.name}
					width={54}
					height={54}
				/>
				<Image
					className="z-10"
					src={achievement.icon}
					alt={achievement.name}
					width={54}
					height={54}
					onLoad={() => {
						setShouldShow(true);
					}}
				/>
			</div>
			<motion.div
				variants={achievementTextVariants}
				className="flex flex-col justify-between overflow-clip"
			>
				<div className="flex flex-row items-center justify-between gap-2">
					<h2 className="font-bold whitespace-nowrap">{achievement.name}</h2>
					<span className="text-xl font-extrabold text-green-400">
						+{achievement.score}
					</span>
				</div>
				<p className="m-0 text-sm whitespace-nowrap">
					{achievement.description}
				</p>
			</motion.div>
		</motion.div>
	);
};
