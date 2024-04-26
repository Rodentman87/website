import { QuestStore } from "quests/QuestStore";
import { createContext, useContext } from "react";

export const QuestStoreContext = createContext(new QuestStore());

export function useQuestStore() {
	return useContext(QuestStoreContext);
}
