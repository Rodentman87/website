import { Quest } from "./QuestStore";

export const QUESTS = [
	{
		id: "test",
		name: "Test Quest",
		description: "This is a test quest",
		reward: "2 Skill Points",
		requirements: [
			{
				type: "boolean",
				id: "complete",
				label: "Do the thing",
			},
			{
				type: "number",
				id: "count",
				label: "Count the things",
				number: 5,
			},
		],
	},
] as const satisfies Quest[];
