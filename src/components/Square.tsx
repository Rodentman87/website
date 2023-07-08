"use client";
import { cubicBezier, motion } from "framer-motion";
import { useAchievementStore } from "hooks/useAchievementStore";
import React, { useEffect, useLayoutEffect } from "react";

const squareCode = "⬜ 🟩 🟧 🟨 🟨 🟥 🟥 🟦".split(" ");
const squares = "🟩 🟫 🟪 🟧 🟨 ⬛ 🟥 🟦 ⬜".split(" ");

const sideVariants = ({
	width,
	height,
}: {
	width: number;
	height: number;
}) => ({
	hidden: {
		width: 0,
	},
	shrink1: {
		width: [0, Math.max(0, width - height), width],
		transition: { duration: 5, ease: "linear" },
	},
	shrink2: {
		width: width + 25,
		transition: { duration: 0 },
	},
	grow: {
		width: width + 25,
	},
	enteredWrong: {
		width: width + 25,
	},
	enteredCorrect: {
		width: width + 25,
	},
});

const topBottomVariants = ({
	width,
	height,
}: {
	width: number;
	height: number;
}) => ({
	hidden: {
		height: 0,
	},
	shrink1: {
		height: [0, Math.max(0, height - width), height],
		transition: { duration: 5, ease: "linear" },
	},
	shrink2: {
		height: height + 25,
		transition: { duration: 0 },
	},
	grow: {
		height: height + 25,
	},
	enteredWrong: {
		height: height + 25,
	},
	enteredCorrect: {
		height: height + 25,
	},
});

const squareVariants = ({
	width,
	height,
}: {
	width: number;
	height: number;
}) => ({
	hidden: {
		opacity: 0,
		width: 50,
		height: 50,
		x: -25,
		y: -25,
	},
	shrink1: {
		opacity: 1,
		transition: { delay: 5, duration: 0.5 },
		transitionEnd: {
			cursor: "pointer",
		},
	},
	shrink2: {
		opacity: 1,
		y: [
			-25,
			height - 25,
			height - 25 - 15,
			height - 25,
			height - 25 - 5,
			height - 25,
		],
		x: [-25, -28, -32, -35, -38, -42],
		transition: { duration: 0.5, ease: cubicBezier(0.7, 0, 1, 0.67) },
		transitionEnd: {
			cursor: "pointer",
		},
	},
	grow: {
		opacity: 1,
		x: -175,
		y: -175,
		width: 350,
		height: 350,
	},
	enteredWrong: {
		opacity: 1,
		backgroundColor: "#ff0000",
		x: [-170, -175, -180, -175],
		y: -175,
		width: 350,
		height: 350,
		transition: { duration: 0.5 },
	},
	enteredCorrect: {
		opacity: 0,
		backgroundColor: "#00ff00",
		x: -175,
		y: -175,
		width: 350,
		height: 350,
		transition: { duration: 2 },
	},
});

enum AnimationStep {
	Hidden = "hidden",
	Shrink1 = "shrink1",
	Shrink2 = "shrink2",
	Grow = "grow",
	EnteredWrong = "enteredWrong",
	EnteredCorrect = "enteredCorrect",
}

export const Square: React.FC<{ onHide: () => void }> = ({ onHide }) => {
	const [size, setSize] = React.useState({ width: 0, height: 0 });
	const [animationStep, setAnimationStep] = React.useState<AnimationStep>(
		AnimationStep.Shrink1
	);

	const achievementStore = useAchievementStore();

	const [attempts, setAttempts] = React.useState(0);
	const [enteredCode, setEnteredCode] = React.useState<string[]>([]);

	useEffect(() => {
		if (enteredCode.length === squareCode.length) {
			// Check if the code is correct
			if (enteredCode.every((code, index) => code === squareCode[index])) {
				// Correct
				setAnimationStep(AnimationStep.EnteredCorrect);
				setEnteredCode([]);
				setTimeout(() => {
					setAnimationStep(AnimationStep.Hidden);
					setTimeout(() => {
						achievementStore.markProgress("square", true);
					}, 1500);
				}, 2000);
			} else {
				// Wrong
				setAnimationStep(AnimationStep.EnteredWrong);
				setEnteredCode([]);
				if (attempts === 2) {
					setTimeout(() => {
						setAnimationStep(AnimationStep.Hidden);
					}, 500);
				} else {
					setAttempts(attempts + 1);
					setTimeout(() => {
						setAnimationStep(AnimationStep.Grow);
					}, 500);
				}
			}
		}
	}, [enteredCode]);

	useLayoutEffect(() => {
		const width = (window.visualViewport.width - 50) / 2;
		const height = (window.visualViewport.height - 50) / 2;
		setSize({ width, height });
	}, []);

	return (
		<div
			style={{ zIndex: 250 }}
			className="fixed top-0 left-0 w-screen h-screen"
		>
			{/* Top */}
			<motion.div
				className="absolute top-0 left-0 w-full bg-black"
				initial={"hidden"}
				animate={animationStep}
				variants={topBottomVariants(size)}
				onAnimationComplete={(e) => {
					if (e === "hidden") {
						onHide();
					}
				}}
			/>
			{/* Bottom */}
			<motion.div
				className="absolute bottom-0 left-0 w-full bg-black"
				initial={"hidden"}
				animate={animationStep}
				variants={topBottomVariants(size)}
			/>
			{/* Left */}
			<motion.div
				className="absolute top-0 left-0 h-full bg-black"
				initial={"hidden"}
				animate={animationStep}
				variants={sideVariants(size)}
			/>
			{/* Right */}
			<motion.div
				className="absolute top-0 right-0 h-full bg-black"
				initial={"hidden"}
				animate={animationStep}
				variants={sideVariants(size)}
			/>
			{/* Square */}
			<motion.div
				className="absolute bg-white top-1/2 left-1/2"
				initial={"hidden"}
				animate={animationStep}
				onClick={() => {
					if (animationStep === AnimationStep.Shrink1) {
						setAnimationStep(AnimationStep.Shrink2);
					} else if (animationStep === AnimationStep.Shrink2) {
						setAnimationStep(AnimationStep.Grow);
					}
				}}
				variants={squareVariants(size)}
			>
				<motion.div
					variants={{
						hidden: {
							opacity: 0,
							scale: 0,
						},
						grow: {
							opacity: 1,
							scale: 1,
							transition: {
								delay: 0.5,
							},
						},
					}}
					className="relative grid w-full h-full grid-cols-3 grid-rows-3 gap-2 text-4xl"
				>
					{squares.map((square) => (
						<button
							key={square}
							className="hover:drop-shadow-md active:drop-shadow-sm"
							onClick={() => setEnteredCode((old) => [...old, square])}
						>
							{square}
						</button>
					))}
					<div className="absolute left-0 w-full text-sm text-center -bottom-8">
						{enteredCode.join(" ")}
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export const SquareReveal: React.FC<{ onClick: () => void }> = ({
	onClick,
}) => {
	return (
		<motion.button
			variants={{
				hidden: {
					opacity: 0,
				},
				visible: {
					opacity: 1,
					transition: {
						delay: 1,
					},
				},
			}}
			initial={"hidden"}
			whileHover={"visible"}
			className="fixed w-8 h-8 select-none bottom-2 right-2"
			onClick={onClick}
		>
			<motion.div
				variants={{
					hidden: {
						x: 150,
						opacity: 0,
					},
					visible: {
						x: "-75%",
						opacity: 1,
						transition: {
							delay: 1.5,
							duration: 1,
						},
					},
				}}
				className="absolute p-1 text-xs rounded-md -translate-x-3/4 -top-6 w-max bg-slate-200"
			>
				Psst. Got a code?
			</motion.div>
			🟥
		</motion.button>
	);
};
