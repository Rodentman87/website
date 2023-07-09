export enum AchievementRarity {
	/**
	 * Normal achievement animation
	 */
	COMMON,
	/**
	 * Adds a glint effect
	 */
	UNCOMMON,
	/**
	 * Adds confetti
	 */
	RARE,
	/**
	 * Slows down the animation and adds more confetti
	 */
	EPIC,
	LEGENDARY,
}

export const ACHIEVEMENTS = [
	{
		id: "blurry",
		name: "Blurry",
		description: "I can't see without my glasses!",
		rarity: AchievementRarity.COMMON,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 1,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-5",
		name: "Still blurry",
		description: "That wasn't a joke, I can't see without my glasses.",
		rarity: AchievementRarity.COMMON,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 5,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-10",
		name: "You keep taking them",
		description: "I really do need these to see",
		rarity: AchievementRarity.UNCOMMON,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 10,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-25",
		name: "You better not break these",
		description: "These are expensive you know",
		rarity: AchievementRarity.RARE,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 25,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-50",
		name: "This is getting ridiculous",
		description: "What are you doing with these?",
		rarity: AchievementRarity.EPIC,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 50,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-100",
		name: "Oh come on now",
		description: "Please stop taking my glasses 😭",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 100,
			},
		],
		score: 50,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "shooting-stars-5",
		name: "Shooting Stars",
		description: "You've seen 5 shooting stars!",
		rarity: AchievementRarity.UNCOMMON,
		requirements: [
			{
				metricId: "shootingStarsSeen",
				number: 5,
			},
		],
		score: 10,
		icon: "/comet_2604-fe0f.png",
	},
	{
		id: "shooting-stars-20",
		name: "Meteor Shower",
		description: "You've seen 20 shooting stars!",
		rarity: AchievementRarity.EPIC,
		requirements: [
			{
				metricId: "shootingStarsSeen",
				number: 20,
			},
		],
		score: 20,
		icon: "/comet_2604-fe0f.png",
	},
	{
		id: "carded",
		name: "Carded",
		description: "You've clicked my project cards a few times",
		rarity: AchievementRarity.RARE,
		requirements: [
			{
				metricId: "cardClicks",
				number: 5,
			},
		],
		score: 10,
		icon: "/identification-card_1faaa.png",
	},
	{
		id: "fancy",
		name: "Fancy",
		description: "You've enabled fancy effects!",
		rarity: AchievementRarity.UNCOMMON,
		requirements: [
			{
				metricId: "fancyEffects",
			},
		],
		score: 10,
		icon: "/gem_stone_3d.png",
	},
	{
		id: "achievements-5",
		name: "5 Achievements",
		description: "You've completed 5 achievements!",
		rarity: AchievementRarity.UNCOMMON,
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 5,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
	},
	{
		id: "achievements-10",
		name: "10 Achievements",
		description: "Wow that's quite a few!",
		rarity: AchievementRarity.RARE,
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 10,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
	},
	{
		id: "achievements-11",
		name: "11 Achievements",
		description: "Yes I did copy this joke from Square's site",
		rarity: AchievementRarity.RARE,
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 11,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
	},
	{
		id: "confetti-achievements-5",
		name: "Confetti Time",
		description: "You've completed 5 achievements with confetti!",
		rarity: AchievementRarity.EPIC,
		requirements: [
			{
				metricId: "confettiAchievmenetsComplete",
				number: 5,
			},
		],
		score: 10,
		icon: "/confetti-ball_1f38a.png",
	},
	{
		id: "birthday",
		name: "Happy Birthday!",
		description: "You've visited on my birthday!",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "birthday",
			},
		],
		score: 10,
		icon: "/party-popper_1f389.png",
	},
	{
		id: "time-travel",
		name: "That's not right",
		description: "Achievements weren't implemented yet!",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "timeTravel",
			},
		],
		score: 10,
		icon: "/mantelpiece-clock_1f570-fe0f.png",
	},
	{
		id: "square",
		name: "True Square",
		description: "This is shaping up to be a lot of achievements",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "square",
			},
		],
		score: 100,
		icon: "/large-red-square_1f7e5.png",
		customAchievementClasses: "rounded-none",
		filterAchievementClasses: "rounded-full",
		ignoreCompletion: true,
	},
	{
		id: "tabs",
		name: "Tabbed",
		description: "You've opened my home page on 5 separate tabs!",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "fiveTabs",
			},
		],
		score: 20,
		icon: "/bookmark-tabs_1f4d1.png",
	},
	{
		id: "prideMonth",
		name: "Pride Month",
		description: "You've visited during Pride Month!",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "prideMonth",
			},
		],
		score: 50,
		icon: "/rainbow_1f308.png",
	},
	{
		id: "log-it",
		name: "Log It",
		description: "I see you snooping around in there!",
		rarity: AchievementRarity.EPIC,
		requirements: [
			{
				metricId: "console",
			},
		],
		score: 10,
		icon: "/wood_1fab5.png",
	},
	{
		id: "iss",
		name: "ISS",
		description: "You've visited while the ISS was over Houston!",
		rarity: AchievementRarity.EPIC,
		requirements: [
			{
				metricId: "iss",
			},
		],
		score: 10,
		icon: "/satellite_1f6f0-fe0f.png",
	},
	{
		id: "locked",
		name: "Locked",
		description: "Yeah, this is a pretty common one",
		rarity: AchievementRarity.UNCOMMON,
		requirements: [
			{
				metricId: "lock",
			},
		],
		score: 10,
		icon: "/locked_1f512.png",
	},
	{
		id: "all-achievements",
		name: "Completionist",
		description: "You've completed all achievements!",
		rarity: AchievementRarity.LEGENDARY,
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 0,
			},
		],
		score: 100,
		icon: "/hundred-points_1f4af.png",
		ignoreCompletion: true,
	},
] as const;

(
	ACHIEVEMENTS.find((a) => a.id === "all-achievements")!.requirements[0] as {
		number: number;
	}
).number = ACHIEVEMENTS.filter((a) => !("ignoreCompletion" in a)).length;
