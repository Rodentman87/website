export const ACHIEVEMENTS = [
	{
		id: "blurry",
		name: "Blurry",
		description: "I can't see without my glasses!",
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
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 50,
			},
		],
		score: 10,
		icon: "/maisy-no-glasses.png",
		confetti: true,
	},
	{
		id: "blurry-100",
		name: "Oh come on now",
		description: "Please stop taking my glasses 😭",
		requirements: [
			{
				metricId: "glassesRemoved",
				number: 100,
			},
		],
		score: 50,
		icon: "/maisy-no-glasses.png",
		confetti: true,
	},
	{
		id: "shooting-stars-5",
		name: "Shooting Stars",
		description: "You've seen 5 shooting stars!",
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
		requirements: [
			{
				metricId: "shootingStarsSeen",
				number: 20,
			},
		],
		score: 20,
		icon: "/comet_2604-fe0f.png",
		confetti: true,
	},
	{
		id: "carded",
		name: "Carded",
		description: "You've clicked my project cards a few times",
		requirements: [
			{
				metricId: "cardClicks",
				number: 5,
			},
		],
		score: 10,
		icon: "/identification-card_1faaa.png",
		confetti: true,
	},
	{
		id: "fancy",
		name: "Fancy",
		description: "You've enabled fancy effects!",
		requirements: [
			{
				metricId: "fancyEffects",
			},
		],
		score: 10,
		icon: "/gem_stone_3d.png",
		confetti: true,
	},
	{
		id: "achievements-5",
		name: "5 Achievements",
		description: "You've completed 5 achievements!",
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 5,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
		confetti: true,
	},
	{
		id: "achievements-10",
		name: "10 Achievements",
		description: "Wow that's quite a few!",
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 10,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
		confetti: true,
	},
	{
		id: "achievements-11",
		name: "11 Achievements",
		description: "Yes I did copy this joke from Square's site",
		requirements: [
			{
				metricId: "achievementsComplete",
				number: 11,
			},
		],
		score: 10,
		icon: "/trophy_1f3c6.png",
		confetti: true,
	},
	{
		id: "confetti-achievements-5",
		name: "Confetti Time",
		description: "You've completed 5 achievements with confetti!",
		requirements: [
			{
				metricId: "confettiAchievmenetsComplete",
				number: 5,
			},
		],
		score: 10,
		icon: "/confetti-ball_1f38a.png",
		confetti: true,
	},
	{
		id: "birthday",
		name: "Happy Birthday!",
		description: "You've visited on my birthday!",
		requirements: [
			{
				metricId: "birthday",
			},
		],
		score: 10,
		icon: "/party-popper_1f389.png",
		confetti: true,
	},
	{
		id: "time-travel",
		name: "That's not right",
		description: "Achievements weren't implemented yet!",
		requirements: [
			{
				metricId: "timeTravel",
			},
		],
		score: 10,
		icon: "/mantelpiece-clock_1f570-fe0f.png",
		confetti: true,
	},
] as const;
