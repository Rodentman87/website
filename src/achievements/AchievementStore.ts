import EventEmitter from "eventemitter3";
import { ACHIEVEMENTS } from "./achievementList";
import { METRICS } from "./metricsList";

const ACHIEVEMENTS_KEY = "metrics-progress";
const ACHIEVEMENTS_VERSION = "1";
const ACHIEVEMENTS_VERSION_KEY = "metrics-version";

export type Achievement = {
	id: string;
	name: string;
	description: string;
	requirements: AchievementRequirement[];
	completed: boolean;
	score: number;
	icon: string;
};

export type AchievementRequirement =
	| AchievementNumberRequirement
	| AchievementBooleanRequirement;

type AchievementNumberRequirement = {
	metricId: string;
	number: number;
};

type AchievementBooleanRequirement = {
	metricId: string;
};

export type AchievementMetric = {
	id: string;
	name: string;
	type: "number" | "boolean";
};

interface MetricTypeMap {
	number: number;
	boolean: boolean;
}

type MetricProgress = {
	id: string;
	value: number | boolean;
};

type AchievementStoreEvents = {
	achievementCompleted: (achievement: Achievement) => void;
};

export class AchievementStore extends EventEmitter<AchievementStoreEvents> {
	achievements: Achievement[];
	metrics: AchievementMetric[];
	metricsProgress: Record<string, MetricProgress>;
	metricToAchievementMap = new Map<string, Set<string>>();

	constructor() {
		super();
		this.achievements = ACHIEVEMENTS.map((a) => {
			return {
				...a,
				completed: false,
			};
		}) as unknown as Achievement[];
		this.achievements.forEach((a) => {
			a.requirements.forEach((r) => {
				if (!this.metricToAchievementMap.has(r.metricId)) {
					this.metricToAchievementMap.set(r.metricId, new Set());
				}
				this.metricToAchievementMap.get(r.metricId)!.add(a.id);
			});
		});
		this.metricsProgress = {};
		this.metrics = METRICS as unknown as AchievementMetric[];
		if (typeof window !== "undefined") {
			this.loadFromLocalStorage();
		}
	}

	loadFromLocalStorage() {
		if (
			localStorage.getItem(ACHIEVEMENTS_VERSION_KEY) !== ACHIEVEMENTS_VERSION
		) {
			// Clear out old achievements
			localStorage.removeItem(ACHIEVEMENTS_KEY);
		}
		const data = localStorage.getItem(ACHIEVEMENTS_KEY);
		if (data) {
			this.metricsProgress = JSON.parse(data);
			this.achievements.forEach((a) => {
				this.checkAchievementCompleted(a.id, true);
			});
		}
	}

	saveToLocalStorage() {
		localStorage.setItem(
			ACHIEVEMENTS_KEY,
			JSON.stringify(this.metricsProgress)
		);
		localStorage.setItem(ACHIEVEMENTS_VERSION_KEY, ACHIEVEMENTS_VERSION);
	}

	checkAchievementCompleted(achievementId: string, skipEvent = false) {
		const achievement = this.achievements.find((a) => a.id === achievementId);
		if (!achievement) {
			return;
		}

		if (achievement.completed) {
			return;
		}

		const completed = achievement.requirements.every((r) => {
			const progress = this.metricsProgress[r.metricId];
			if (!progress) {
				return false;
			}
			const metric = this.metrics.find((m) => m.id === r.metricId);
			if (!metric) {
				return false;
			}
			switch (metric.type) {
				case "number":
					return (
						(progress.value as number) >=
						(r as AchievementNumberRequirement).number
					);
				case "boolean":
					return progress.value === true;
			}
		});

		if (completed) {
			achievement.completed = true;
			if (!skipEvent) this.emit("achievementCompleted", achievement);
		}
	}

	markProgress<T extends (typeof METRICS)[number]["id"]>(
		metricId: T,
		value: MetricTypeMap[Extract<(typeof METRICS)[number], { id: T }>["type"]]
	) {
		// Grab the metric from the list
		const metric = this.metrics.find((m) => m.id === metricId);
		if (!metric) {
			return;
		}

		// Update the progress
		if (!this.metricsProgress[metricId]) {
			this.metricsProgress[metricId] = {
				id: metricId,
				value,
			};
		} else {
			switch (metric.type) {
				case "number":
					(this.metricsProgress[metricId].value as number) += value;
					break;
				case "boolean":
					this.metricsProgress[metricId].value = true;
					break;
			}
		}

		// Check if any achievements are completed
		const achievements = this.metricToAchievementMap.get(metricId);
		if (achievements) {
			achievements.forEach((a) => {
				this.checkAchievementCompleted(a);
			});
		}

		// Save to local storage
		this.saveToLocalStorage();
	}
}
