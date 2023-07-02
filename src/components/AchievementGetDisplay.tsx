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
	const [achievementsToBeDisplayed, setAchievementsToBeDisplayed] =
		React.useState([]);

	const onAchievementGet = useCallback(
		(achievement: Achievement) => {
			setAchievementsToBeDisplayed((prev) => [...prev, achievement]);
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
				<AnimatePresence>
					{achievementsToBeDisplayed.map((achievement) => (
						<SingleAchievement
							achievement={achievement}
							clearAchievement={(id) => {
								setAchievementsToBeDisplayed((prev) =>
									prev.filter((a) => a.id !== achievement.id)
								);
							}}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

const SingleAchievement: React.FC<{
	achievement: Achievement;
	clearAchievement: (id: string) => void;
}> = ({ achievement, clearAchievement }) => {
	const [shouldShow, setShouldShow] = React.useState(
		achievement.icon !== undefined ? false : true
	);

	return (
		<motion.div
			key={achievement.id}
			className="relative flex flex-row p-2 text-black bg-gray-300 border border-gray-400 border-solid rounded-full bg-opacity-40 backdrop-blur-md overflow-clip border-opacity-40"
			variants={achievementGetBodyVariants}
			initial="hidden"
			animate={shouldShow ? "shown" : "hidden"}
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
			<Image
				src={achievement.icon}
				alt={achievement.name}
				width={54}
				height={54}
				onLoad={() => {
					setShouldShow(true);
					setTimeout(() => {
						clearAchievement(achievement.id);
					}, 5000);
				}}
			/>
			<motion.div
				variants={achievementTextVariants}
				className="flex flex-col justify-between overflow-clip"
			>
				<h2 className="font-bold whitespace-nowrap">{achievement.name}</h2>
				<p className="m-0 text-sm whitespace-nowrap">
					{achievement.description}
				</p>
			</motion.div>
		</motion.div>
	);
};
