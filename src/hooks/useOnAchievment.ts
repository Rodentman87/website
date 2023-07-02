import { Achievement } from "achievements/AchievementStore";
import { useEffect } from "react";
import { useAchievementStore } from "./useAchievementStore";

export function useOnAchievment(handler: (achievement: Achievement) => void) {
	const achievementStore = useAchievementStore();

	useEffect(() => {
		achievementStore.on("achievementCompleted", handler);
		return () => {
			achievementStore.off("achievementCompleted", handler);
		};
	}, [achievementStore, handler]);
}
