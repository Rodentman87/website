import { AchievementStore } from "achievements/AchievementStore";
import { createContext, useContext } from "react";

export const AchievementStoreContext = createContext(new AchievementStore());

export function useAchievementStore() {
	return useContext(AchievementStoreContext);
}
