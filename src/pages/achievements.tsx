import { FunnyButtonLol } from "@components/FunnyButtonLol";
import { Achievement } from "achievements/AchievementStore";
import { ACHIEVEMENTS } from "achievements/achievementList";
import clsx from "clsx";
import Color from "color";
import { extractColors, getBestColors } from "helpers/colors";
import { useAchievementMetrics } from "hooks/useAchievementMetrics";
import { useAchievementStore } from "hooks/useAchievementStore";
import { useCompletedAchievements } from "hooks/useCompletedAchievements";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Layout from "../components/layout";

export default function AchievmentsList() {
	const achievementStore = useAchievementStore();
	const metricsProgress = useAchievementMetrics();

	return (
		<Layout>
			<Head>
				<title>Achievments</title>
			</Head>
			<section>
				<div className="p-2 mb-2 bg-gray-100 rounded-md shadow-md">
					<h2>Reset Progress</h2>
					<p className="m-0 mt-1">
						<button
							onClick={() => {
								achievementStore.metricsProgress = {};
								achievementStore.achievements.forEach((achievement) => {
									achievement.completed = false;
								});
								achievementStore.completedAchievements = [];
								achievementStore.achievementCompletedListSubscribers.forEach(
									(s) => s()
								);
								achievementStore.saveToLocalStorage();
							}}
							disabled={Object.keys(metricsProgress).length === 0}
							className="p-2 text-white transition-shadow bg-red-500 rounded-lg shadow-sm hover:shadow-md disabled:hover:shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
						>
							Reset Progress
						</button>
					</p>
					<h2>Free Achievement</h2>
					<p className="m-0 mt-1">
						<FunnyButtonLol />
					</p>
				</div>
				<div className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md shadow-md">
					<h2>Achievements</h2>
					{(ACHIEVEMENTS as unknown as Achievement[]).map((achievement) => {
						const [primaryColorRGB, setPrimaryColorRGB] =
							useState<string>("255 255 255");
						const [secondaryColorRGB, setSecondaryColorRGB] =
							useState<string>("0 0 0");
						const completed = useCompletedAchievements();
						const isCompleted = completed.includes(achievement.id);

						return (
							<div
								key={achievement.id}
								onClick={() => {
									if (achievement.id !== "locked") return;
									achievementStore.markProgress("lock", true);
								}}
								style={{
									borderColor: `rgb(${primaryColorRGB})`,
								}}
								className={clsx(
									"relative p-2 bg-white bg-opacity-25 border-2 border-solid rounded-md shadow-md overflow-clip",
									{
										"cursor-pointer":
											achievement.id === "locked" && !isCompleted,
									}
								)}
							>
								{!isCompleted && (
									<div className="absolute top-0 left-0 z-50 flex flex-row items-center justify-center w-full h-full bg-gray-400 bg-opacity-25 backdrop-blur-md">
										<Image
											src="/locked_1f512.png"
											alt="locked"
											width={64}
											height={64}
										/>
									</div>
								)}
								<h3 className="text-2xl font-semibold">{achievement.name}</h3>
								<div>
									<p className="m-0">{achievement.description}</p>
								</div>
								<Image
									unoptimized
									className="absolute z-0 top-2 right-2 blur-sm saturate-200"
									src={achievement.icon}
									alt={achievement.name}
									width={64}
									height={64}
								/>
								<Image
									unoptimized
									className="absolute z-10 top-2 right-2"
									src={achievement.icon}
									alt={achievement.name}
									width={64}
									height={64}
									onLoad={async (e) => {
										const colors = await extractColors(
											achievement.icon,
											e.target as HTMLImageElement
										);
										const bestColors = getBestColors(colors, Color("#FFFFFF"));
										setPrimaryColorRGB(
											`${bestColors.primary.red()} ${bestColors.primary.green()} ${bestColors.primary.blue()}`
										);
										setSecondaryColorRGB(
											`${bestColors.secondary.red()} ${bestColors.secondary.green()} ${bestColors.secondary.blue()}`
										);
									}}
								/>
							</div>
						);
					})}
				</div>
			</section>
		</Layout>
	);
}
