import EventEmitter from "eventemitter3";
import { ACHIEVEMENTS } from "./achievementList";

const ACHIEVEMENTS_KEY = "achievement-progress";

export type Achievement = {
	id: string;
	name: string;
	description: string;
	numberNeeded: number;
	icon: string;
};

type AchievementProgress = {
	id: string;
	numberCompleted: number;
	markedCompleted: boolean;
};

type AchievementStoreEvents = {
	achievementCompleted: (achievement: Achievement) => void;
};

export class AchievementStore extends EventEmitter<AchievementStoreEvents> {
	achievements: Achievement[];
	achievementProgress: Record<string, AchievementProgress>;

	constructor() {
		super();
		this.achievements = ACHIEVEMENTS as unknown as Achievement[];
		this.achievementProgress = {};
		if (typeof window !== "undefined") {
			this.loadFromLocalStorage();
		}
	}

	loadFromLocalStorage() {
		const data = localStorage.getItem(ACHIEVEMENTS_KEY);
		if (data) {
			this.achievementProgress = JSON.parse(data);
		}
	}

	saveToLocalStorage() {
		localStorage.setItem(
			ACHIEVEMENTS_KEY,
			JSON.stringify(this.achievementProgress)
		);
	}

	markProgress(
		achievementId: (typeof ACHIEVEMENTS)[number]["id"],
		amount: number = 1
	) {
		// Grab the achievement from the list
		const achievement = this.achievements.find(
			(achievement) => achievement.id === achievementId
		);
		if (!achievement) {
			throw new Error(
				`No achievement with id ${achievementId}, you done goofed and forgot to add it to the list`
			);
		}
		// If we haven't marked progress for this achievement yet, create a new entry
		if (!(achievementId in this.achievementProgress)) {
			this.achievementProgress[achievementId] = {
				id: achievementId,
				numberCompleted: 0,
				markedCompleted: false,
			};
		}
		const progress = this.achievementProgress[achievementId];
		if (!progress.markedCompleted) {
			progress.numberCompleted += amount;
			this.saveToLocalStorage();
		}
		// If we've completed the achievement, mark it as completed and emit an event
		if (
			progress.numberCompleted >= achievement.numberNeeded &&
			!progress.markedCompleted
		) {
			progress.markedCompleted = true;
			this.saveToLocalStorage();
			this.emit("achievementCompleted", achievement);
		}
	}
}
