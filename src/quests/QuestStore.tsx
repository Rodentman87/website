import EventEmitter from "eventemitter3";
import { QUESTS } from "./questList";

const QUESTS_KEY = "quests-progress";
const QUESTS_VERSION = "1";
const QUESTS_VERSION_KEY = "quests-version";

type QuestFromID<QuestID extends (typeof QUESTS)[number]["id"]> = Extract<
	(typeof QUESTS)[number],
	{ id: QuestID }
>;

type RequirementFromID<
	Q extends Quest,
	RequirementID extends Q["requirements"][number]["id"]
> = Extract<Q["requirements"][number], { id: RequirementID }>;

export type Quest = {
	id: string;
	name: string;
	description: string;
	reward: string;
	requirements: QuestRequirement[];
};

export type ActualQuest = (typeof QUESTS)[number];

export type QuestProgress = {
	id: string;
	requirementProgress: QuestRequirementProgress[];
	completed: boolean;
	accepted: boolean;
	active: boolean;
};

export type QuestRequirementProgress =
	| QuestNumberRequirementProgress
	| QuestBooleanRequirementProgress;

export type QuestNumberRequirementProgress = {
	id: string;
	value: number;
};

export type QuestBooleanRequirementProgress = {
	id: string;
	value: boolean;
};

export type QuestRequirement = QuestNumberRequirement | QuestBooleanRequirement;

export type QuestNumberRequirement = {
	type: "number";
	id: string;
	label: string;
	number: number;
};

export type QuestBooleanRequirement = {
	type: "boolean";
	id: string;
	label: string;
};

interface RequirementTypeMap {
	number: number;
	boolean: boolean;
}

const RequirementInitializers: Record<
	keyof RequirementTypeMap,
	(id: string) => QuestRequirementProgress
> = {
	number: (id: string) => ({ id, value: 0 }),
	boolean: (id: string) => ({ id, value: false }),
};

type QuestStoreEvents = {
	questAccepted: (quest: Quest) => void;
	changeActiveQuest: (quest: Quest) => void;
	questProgressUpdated: (
		quest: Quest,
		oldProgress: QuestProgress,
		newProgress: QuestProgress
	) => void;
	questFinished: (quest: Quest) => void;
};

export class QuestStore extends EventEmitter<QuestStoreEvents> {
	quests: Quest[];
	private privateQuestsProgress: Record<string, QuestProgress>;
	set questsProgress(value: Record<string, QuestProgress>) {
		this.privateQuestsProgress = value;
		this.questsProgressSubscribers.forEach((s) => s());
	}
	get questsProgress() {
		return this.privateQuestsProgress;
	}
	private questsProgressSubscribers = new Set<() => void>();
	questCompleteledListSubscribers = new Set<() => void>();

	constructor() {
		super();
		this.quests = QUESTS.map((a) => {
			return {
				...a,
				completed: false,
			};
		}) as unknown as Quest[];

		this.questsProgress = {};
		this.subscribeToQuestsProgress = this.subscribeToQuestsProgress.bind(this);
		this.subscribeToQuestCompletedList =
			this.subscribeToQuestCompletedList.bind(this);
		if (typeof window !== "undefined") {
			this.loadFromLocalStorage();
		}
	}

	subscribeToQuestsProgress(callback: () => void) {
		this.questsProgressSubscribers.add(callback);
		return () => {
			this.questsProgressSubscribers.delete(callback);
		};
	}

	subscribeToQuestCompletedList(callback: () => void) {
		this.questCompleteledListSubscribers.add(callback);
		return () => {
			this.questCompleteledListSubscribers.delete(callback);
		};
	}

	loadFromLocalStorage() {
		if (localStorage.getItem(QUESTS_VERSION_KEY) !== QUESTS_VERSION) {
			// Clear out old achievements
			localStorage.removeItem(QUESTS_KEY);
		}
		const data = localStorage.getItem(QUESTS_KEY);
		if (data) {
			this.questsProgress = JSON.parse(data);
		}
		window.addEventListener("storage", (e) => {
			if (e.key !== QUESTS_KEY) return;
			const data = localStorage.getItem(QUESTS_KEY);
			if (data) {
				this.questsProgress = JSON.parse(data);
			}
		});
	}

	saveToLocalStorage() {
		localStorage.setItem(QUESTS_KEY, JSON.stringify(this.questsProgress));
		localStorage.setItem(QUESTS_VERSION_KEY, QUESTS_VERSION);
	}

	getQuest<QuestID extends (typeof QUESTS)[number]["id"]>(questId: QuestID) {
		return this.quests.find((q) => q.id === questId);
	}

	get activeQuest(): ActualQuest | null {
		// Find the progress marked active
		const activeQuest = Object.values(this.questsProgress).find(
			(q) => q.active
		);
		if (!activeQuest) return null;
		return this.getQuest(
			activeQuest.id as (typeof QUESTS)[number]["id"]
		) as ActualQuest;
	}

	getQuestProgress<QuestID extends (typeof QUESTS)[number]["id"]>(
		questId: QuestID
	) {
		const quest = QUESTS.find((q) => q.id === questId);
		if (!quest) throw new Error(`Quest ${questId} does not exist`);
		if (!(questId in this.questsProgress)) {
			// Make the new progress object
			this.questsProgress = {
				...this.questsProgress,
				[questId]: {
					id: questId,
					accepted: false,
					active: false,
					completed: false,
					requirementProgress: quest.requirements.map((r) =>
						RequirementInitializers[r.type](r.id)
					),
				},
			};
		}
		return this.questsProgress[questId];
	}

	reset() {
		this.questsProgress = {};
		this.saveToLocalStorage();
		this.emit("changeActiveQuest", null);
	}

	acceptQuest<QuestID extends (typeof QUESTS)[number]["id"]>(questId: QuestID) {
		const progress = this.getQuestProgress(questId);
		// TODO: Make a system to check if the quest has pre-reqs
		progress.accepted = true;
		progress.active = true;
		this.emit("questAccepted", this.getQuest(questId));
		this.emit("changeActiveQuest", this.getQuest(questId));
		this.saveToLocalStorage();
	}

	markQuestActive<QuestID extends (typeof QUESTS)[number]["id"]>(
		questId: QuestID
	) {
		// Get the old active quest
		const oldActiveQuest = Object.values(this.questsProgress).find(
			(q) => q.active
		);
		if (oldActiveQuest) {
			oldActiveQuest.active = false;
		}
		const progress = this.getQuestProgress(questId);
		progress.active = true;
		this.emit("changeActiveQuest", this.getQuest(questId));
		this.saveToLocalStorage();
	}

	markProgress<
		QuestID extends (typeof QUESTS)[number]["id"],
		RequirementID extends QuestFromID<QuestID>["requirements"][number]["id"]
	>(
		questId: QuestID,
		requirementId: RequirementID,
		value: RequirementTypeMap[RequirementFromID<
			QuestFromID<QuestID>,
			RequirementID
		>["type"]],
		setValue = false
	) {
		// Get the quest progress
		const progress = this.getQuestProgress(questId);
		const newProgess = JSON.parse(JSON.stringify(progress));

		if (!progress.accepted || progress.completed) return; // Don't mark progress on unaccepted quests or completed quests
		const req = newProgess.requirementProgress.find(
			(r) => r.id === requirementId
		)!;
		// Update the progress
		if (setValue) {
			req.value = value;
		} else {
			const reqType = this.getQuest(questId).requirements.find(
				(r) => r.id === requirementId
			)!.type;

			switch (reqType) {
				case "number":
					(req.value as number) += value as unknown as number;
					break;
				case "boolean":
					req.value = value;
					break;
			}
		}

		this.questsProgress[questId] = newProgess;

		// Send the event that the progress was updated
		this.emit(
			"questProgressUpdated",
			this.getQuest(questId),
			progress,
			newProgess
		);

		// Check if all the requirements are met
		const allRequirementsMet = newProgess.requirementProgress.every((r) => {
			const requirement = this.getQuest(questId).requirements.find(
				(req) => req.id === r.id
			)!;
			switch (requirement.type) {
				case "number":
					return (r.value as number) >= requirement.number;
				case "boolean":
					return r.value;
			}
		});
		if (allRequirementsMet) {
			newProgess.completed = true;
			this.emit("questFinished", this.getQuest(questId));
			if (newProgess.active) {
				newProgess.active = false;
				this.emit("changeActiveQuest", null);
			}
		}

		// Save to local storage
		this.saveToLocalStorage();
	}
}
