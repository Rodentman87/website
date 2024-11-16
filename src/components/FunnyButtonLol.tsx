import {
	animate,
	easeOut,
	interpolate,
	motion,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { useAchievementStore } from "modules/achievements/hooks/useAchievementStore";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const FunnyButtonLol: React.FC = () => {
	const textRef = useRef<HTMLSpanElement>(null);
	const [textWidth, setTextWidth] = useState(0);
	useLayoutEffect(() => {
		if (textRef.current) {
			setTextWidth(textRef.current.offsetWidth);
		}
	}, []);

	const progress = useMotionValue(0);
	const firstHeight = useTransform(progress, [0, 0.25, 47, 48], [0, 4, 4, 0]);
	const bar1Width = useTransform(progress, [0.25, 5], [0, 1]);
	const bar2Width = useTransform(progress, [5, 10], [0, 1]);
	const bar3Width = useTransform(progress, [10, 15], [0, 1]);
	const bar4Width = useTransform(
		progress,
		[15, 20, 40, 43, 45, 47],
		[0, 1, 1, 0.25, 0.25, 1]
	);
	const secondHeight = useTransform(
		progress,
		[20, 20.25, 47, 48],
		[0, 4, 4, 0]
	);
	const bar5Width = useTransform(progress, [20.25, 25], [0, 1]);
	const bar6Width = useTransform(progress, [25, 30], [0, 1]);
	const bar7Width = useTransform(progress, [30, 35], [0, 1]);
	const bar8Width = useTransform(progress, [35, 40], [0, 1]);
	const text = useTransform(progress, (progress) => {
		if (progress > 44 && progress < 47) {
			return "Gotcha 😉";
		}
		if (progress === 100) {
			return "🎉 Confirmed 🎉";
		}
		return "Press and hold to confirm";
	});
	const buttonBGColor = useTransform(
		progress,
		[47, 55],
		["#93c5fd", "#4ade80"]
	);
	const dashOffset = useTransform(progress, [55, 65], [0, 128]);
	const dashWidth = useTransform(progress, [55, 56, 65, 66], [0, 6, 6, 0]);
	const dashArray = useTransform(
		progress,
		[55, 60, 65],
		["0, 48", "24, 24", "48, 0"]
	);
	const bigBarBG = useTransform(
		progress,
		[65, 66],
		["rgb(107 114 128 / 0)", "rgb(107 114 128 / 1)"]
	);
	const minWidth = useTransform(progress, [66, 100], ["10%", "100%"], {
		ease: easeOut,
	});

	const achievementStore = useAchievementStore();
	const onPressIn = useCallback(() => {
		animate(progress, 100, {
			ease: "linear",
			// Dynamically calculate the duration based on the current progress
			duration: interpolate([0, 100], [60, 0])(progress.get()),
			onComplete: () => {
				achievementStore.markProgress("patient", true);
			},
		});
	}, [progress]);

	const onRelease = useCallback(() => {
		// If it's the end of the animation, don't reset it
		if (progress.get() === 100) return;
		animate(progress, 0, {
			ease: "linear",
			duration: 1,
		});
	}, [progress]);

	return (
		<motion.div
			style={{
				background: bigBarBG,
			}}
			className="rounded-md"
		>
			<motion.button
				onMouseDown={onPressIn}
				onMouseUp={onRelease}
				style={{
					backgroundColor: buttonBGColor,
					minWidth: minWidth,
				}}
				className="relative flex flex-col items-stretch justify-between p-2 px-4 transition-shadow rounded-md shadow-md hover:shadow-lg active:shadow-inner"
			>
				<motion.svg
					width="100%"
					height="100%"
					style={{}}
					className="absolute inset-0 rounded-md pointer-events-none"
				>
					<motion.rect
						width="100%"
						height="100%"
						rx={6}
						ry={6}
						fill="none"
						stroke="#a855f7"
						strokeWidth={dashWidth}
						strokeDasharray={dashArray}
						strokeDashoffset={dashOffset}
					></motion.rect>
				</motion.svg>
				<motion.div
					style={{
						height: firstHeight,
					}}
					className="relative w-full origin-left bg-gray-200"
				>
					<motion.div
						style={{
							scaleX: bar1Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-green-500"
					/>
					<motion.div
						style={{
							scaleX: bar2Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-red-500"
					/>
					<motion.div
						style={{
							scaleX: bar3Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-orange-400"
					/>
					<motion.div
						style={{
							scaleX: bar4Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-yellow-400"
					/>
				</motion.div>
				<motion.span
					style={{
						minWidth: textWidth,
					}}
					ref={textRef}
				>
					{text}
				</motion.span>
				<motion.div
					style={{
						height: secondHeight,
					}}
					className="relative w-full origin-left bg-gray-200"
				>
					<motion.div
						style={{
							scaleX: bar5Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-green-500"
					/>
					<motion.div
						style={{
							scaleX: bar6Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-blue-500"
					/>
					<motion.div
						style={{
							scaleX: bar7Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-indigo-500"
					/>
					<motion.div
						style={{
							scaleX: bar8Width,
						}}
						className="absolute top-0 bottom-0 left-0 w-full origin-left bg-violet-500"
					/>
				</motion.div>
			</motion.button>
		</motion.div>
	);
};
