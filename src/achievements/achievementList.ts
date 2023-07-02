export const ACHIEVEMENTS = [
	{
		id: "blurry",
		name: "Blurry",
		description: "I can't see without my glasses!",
		numberNeeded: 1,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-10",
		name: "You keep taking them",
		description: "I really do need these to see",
		numberNeeded: 10,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "blurry-100",
		name: "Oh come on now",
		description: "Please stop taking my glasses 😭",
		numberNeeded: 100,
		icon: "/maisy-no-glasses.png",
	},
	{
		id: "shooting-stars",
		name: "Shooting Stars",
		description: "You've seen 20 shooting stars!",
		numberNeeded: 20,
		icon: "/shooting-star.png",
	},
	{
		id: "carded",
		name: "Carded",
		description: "You've clicked my project cards a few times",
		numberNeeded: 5,
		icon: "/carded.png",
	},
] as const;
