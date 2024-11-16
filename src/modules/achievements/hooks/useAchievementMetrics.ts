import { useSyncExternalStore } from "react";
import { useAchievementStore } from "./useAchievementStore";

export function useAchievementMetrics() {
	const store = useAchievementStore();
	const metricsProgress = useSyncExternalStore(
		store.subscribeToMetricsProgress,
		() => store.metricsProgress,
		() => ({})
	);
	return metricsProgress;
}
