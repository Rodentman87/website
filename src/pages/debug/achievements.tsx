import { Achievement } from "achievements/AchievementStore";
import { ACHIEVEMENTS } from "achievements/achievementList";
import Color from "color";
import { extractColors, getBestColors } from "helpers/colors";
import { useAchievementMetrics } from "hooks/useAchievementMetrics";
import { useAchievementStore } from "hooks/useAchievementStore";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Layout from "../../components/layout";

export default function AchievmentsDebug() {
	const achievementStore = useAchievementStore();
	const metricsProgress = useAchievementMetrics();

	return (
		<Layout>
			<Head>
				<title>Achievment Debugging Page</title>
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
								achievementStore.saveToLocalStorage();
							}}
							disabled={Object.keys(metricsProgress).length === 0}
							className="p-2 text-white transition-shadow bg-red-500 rounded-lg shadow-sm hover:shadow-md disabled:hover:shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
						>
							Reset Progress
						</button>
					</p>
				</div>
				<div className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md shadow-md">
					<h2>Achievements</h2>
					{(ACHIEVEMENTS as unknown as Achievement[]).map((achievement) => {
						const [confettiPalette, setConfettiPalette] = useState<
							string[] | undefined
						>();
						const [primaryColorRGB, setPrimaryColorRGB] =
							useState<string>("255 255 255");
						const [secondaryColorRGB, setSecondaryColorRGB] =
							useState<string>("0 0 0");

						return (
							<div
								key={achievement.id}
								style={{
									borderColor: `rgb(${primaryColorRGB})`,
								}}
								className="relative p-2 bg-white border-2 border-solid rounded-md shadow-md"
							>
								<h3 className="text-2xl font-semibold">
									{achievement.name}{" "}
									<span className="text-base italic">({achievement.id})</span>
								</h3>
								<div>
									<p className="m-0">Description: {achievement.description}</p>
									<p className="m-0">Score: {achievement.score}</p>
									<p className="m-0">
										Confetti: {achievement.confetti ? "Yes" : "No"}
									</p>
									{achievement.requirements.map((requirement) => {
										return (
											<code key={requirement.metricId} className="m-0">
												{JSON.stringify(requirement)}
											</code>
										);
									})}
								</div>
								{confettiPalette && (
									<>
										<div className="text-xs">Confetti Palette:</div>
										<div className="flex flex-row w-full mb-1 roudned-lg overflow-clip">
											{confettiPalette.map((color) => {
												return (
													<div
														key={color}
														style={{
															backgroundColor: color,
														}}
														className="h-4 grow"
													/>
												);
											})}
										</div>
									</>
								)}
								<button
									style={{
										backgroundColor: `rgb(${secondaryColorRGB})`,
									}}
									className="w-full text-center text-white transition-shadow rounded-sm shadow-sm hover:shadow-md active:shadow-none"
									onClick={() =>
										achievementStore.emit(
											"achievementCompleted",
											achievement as unknown as Achievement
										)
									}
								>
									Trigger Achievement
								</button>
								<Image
									unoptimized
									className="absolute top-2 right-2 -z-10 blur-md saturate-200"
									src={achievement.icon}
									alt={achievement.name}
									width={54}
									height={54}
								/>
								<Image
									unoptimized
									className="absolute z-10 top-2 right-2"
									src={achievement.icon}
									alt={achievement.name}
									width={54}
									height={54}
									onLoad={async (e) => {
										const colors = await extractColors(
											achievement.icon,
											e.target as HTMLImageElement
										);
										setConfettiPalette(colors.map((c) => c.hex()));
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
