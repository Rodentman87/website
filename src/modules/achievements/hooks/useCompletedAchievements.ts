import { useSyncExternalStore } from "react";
import { useAchievementStore } from "./useAchievementStore";

export function useCompletedAchievements() {
	const store = useAchievementStore();
	const completedAchievements = useSyncExternalStore(
		store.subscribeToAchievementCompletedList,
		() => store.completedAchievements,
		() => []
	);
	return completedAchievements;
}
