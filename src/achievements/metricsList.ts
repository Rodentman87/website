export const METRICS = [
	{
		id: "glassesRemoved",
		name: "Glasses Removed",
		type: "number",
	},
	{
		id: "shootingStarsSeen",
		name: "Shooting Stars Seen",
		type: "number",
	},
	{
		id: "cardClicks",
		name: "Card Clicks",
		type: "number",
	},
	{
		id: "fancyEffects",
		name: "Fancy Effects",
		type: "boolean",
	},
	{
		id: "achievementsComplete",
		name: "Achievements Complete",
		type: "number",
		isMetaMetric: true,
	},
	{
		id: "confettiAchievmenetsComplete",
		name: "Confetti Achievements Complete",
		type: "number",
		isMetaMetric: true,
	},
	{
		id: "birthday",
		name: "Site Opened On Birthday",
		type: "boolean",
	},
	{
		id: "timeTravel",
		name: "Opened Site Before Achievements Were Added",
		type: "boolean",
	},
	{
		id: "square",
		name: "Square",
		type: "boolean",
	},
] as const;
