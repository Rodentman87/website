import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { useAchievementStore } from "modules/achievements/hooks/useAchievementStore";
import React, { useCallback, useMemo } from "react";
import { Portal } from "react-portal";
import { Starfield } from "./Starfield";

export const CyclesCard: React.FC<{
	starLayers: number;
	starsPerLayer: number;
	cyclesEntriesCount: number;
}> = ({ starLayers, starsPerLayer, cyclesEntriesCount }) => {
	const shouldReduceMotion = useReducedMotion();
	const [isHovered, setIsHovered] = React.useState(false);
	const [showAbove, setShowAbove] = React.useState(false);
	const [isMounted, setIsMounted] = React.useState(false);
	const shootingStarInterval = React.useRef<ReturnType<
		typeof setTimeout
	> | null>(null);

	const [shootingStarParams, setShootingStarParams] = React.useState<{
		x: number;
		mirrored: boolean;
		speed: number;
	}>({ x: 0, mirrored: false, speed: 0.7 });
	const [showShootingStar, setShowShootingStar] = React.useState(false);
	const shootingStarContainer = React.useRef<HTMLDivElement>(null);
	const achievementStore = useAchievementStore();

	const keyframes = useMemo(() => {
		return {
			x: Array(50)
				.fill(0)
				.map(() => Math.random() * 4 - 2),
			y: Array(50)
				.fill(0)
				.map(() => Math.random() * 4 - 2),
			rotate: Array(50)
				.fill(0)
				.map(() => Math.random() * 0.5 - 0.25),
		};
	}, []);

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	const doShootingStar = useCallback(() => {
		if (!shootingStarContainer.current) return;
		const area = shootingStarContainer.current.clientWidth * 0.75;
		setShootingStarParams({
			x: Math.random() * area - area / 2,
			mirrored: Math.random() > 0.5,
			speed: Math.random() * 0.5 + 0.5,
		});
		setShowShootingStar(true);
		achievementStore.markProgress("shootingStarsSeen", 1);
		setTimeout(() => {
			setShowShootingStar(false);
		}, 1000);
		shootingStarInterval.current = setTimeout(() => {
			doShootingStar();
		}, Math.random() * 2500 + 3000);
	}, []);

	return (
		<>
			{isMounted && !shouldReduceMotion && (
				<Portal>
					<div
						onClick={(e) => e.stopPropagation()}
						className={clsx(
							"fixed top-0 left-0 z-20 w-screen h-screen transition-all duration-300 pointer-events-none bg-opacity-80",
							{
								"bg-black bg-transition-one-way": isHovered,
							}
						)}
					></div>
				</Portal>
			)}
			<motion.div
				onHoverStart={() => {
					setIsHovered(true);
					setShowAbove(true);
					shootingStarInterval.current = setTimeout(() => {
						doShootingStar();
					}, 9000);
				}}
				onHoverEnd={() => {
					setIsHovered(false);
					if (shootingStarInterval.current)
						clearInterval(shootingStarInterval.current);
				}}
				onTransitionEnd={() => {
					if (isHovered === false) setShowAbove(false);
				}}
				whileHover={shouldReduceMotion ? "default" : "hover"}
				initial={"default"}
				variants={{
					default: {
						x: 0,
						y: 0,
						rotate: 0,
					},
					hover: {
						...keyframes,
						transition: {
							duration: 100,
							repeat: Infinity,
							repeatType: "reverse",
						},
					},
				}}
				className={clsx(
					"relative grow flex flex-col gap-2 p-4 text-gray-200 bg-gray-900 rounded-md shadow-[0px_0px_0px_1px_rgba(123,43,227,0.15)] hover:shadow-[0px_0px_50px_1px_rgba(123,43,227,0.15)]",
					{
						"z-30": showAbove,
						"transition-shadow duration-[10s] delay-[8s]": isHovered,
					}
				)}
			>
				{/* Shooting star */}
				<div
					ref={shootingStarContainer}
					className="absolute top-0 left-0 w-full h-full overflow-clip"
				>
					<motion.div
						className={clsx("absolute bottom-0 w-64 h-64 -top-10 left-1/4", {
							hidden: !showShootingStar,
						})}
						style={{
							translateX: shootingStarParams.x,
							rotateZ: shootingStarParams.mirrored ? 180 : 0,
						}}
						animate={{
							rotate: showShootingStar
								? shootingStarParams.mirrored
									? 130
									: 120
								: -45,
							transition: {
								duration: shootingStarParams.speed,
							},
						}}
					>
						<div className="w-64 h-32 overflow-clip">
							<div className="w-64 h-64 border-r-2 border-white rounded-full"></div>
						</div>
					</motion.div>
				</div>
				{/* Starfields */}
				{[...Array(starLayers)].map((_, i) => (
					<motion.div
						key={i}
						variants={{
							default: {
								scale: 1,
							},
							hover: {
								scale: 1 + (i + 1) * 0.05,
								zIndex: i >= starLayers / 2 ? 100 : undefined,
							},
						}}
						transition={{ duration: 0.6 }}
						className="absolute top-0 left-0 w-full h-full"
					>
						<Starfield starCount={starsPerLayer} addDustCloud={i % 2 === 0} />
					</motion.div>
				))}
				<div className="z-10 flex flex-row items-center gap-2">
					<motion.h3
						variants={{
							hover: {
								scale: 1.1,
								x: -5,
								y: -2,
							},
							default: { scale: 1, x: 0 },
						}}
						transition={{ duration: 0.6 }}
						layoutId="cycles-title"
						className="px-1 text-xl font-bold rounded-md md:text-2xl backdrop-blur-sm"
						style={{
							backgroundColor: "rgba(255, 255, 255, 0.01)",
						}}
					>
						Cycles
					</motion.h3>
				</div>
				<div className="z-10 flex flex-row justify-between sm:flex-row">
					<motion.p
						variants={{
							hover: {
								scale: 1.05,
							},
							default: { scale: 1 },
						}}
						transition={{ duration: 0.6 }}
						className="px-1 m-0 rounded-md backdrop-blur-sm"
						style={{
							backgroundColor: "rgba(255, 255, 255, 0.01)",
						}}
					>
						A journal
					</motion.p>
					<motion.p
						variants={{
							hover: {
								scale: 1.05,
							},
							default: { scale: 1 },
						}}
						transition={{ duration: 0.6 }}
						className="px-1 m-0 rounded-md backdrop-blur-sm"
						style={{
							backgroundColor: "rgba(255, 255, 255, 0.01)",
						}}
					>
						{cyclesEntriesCount} entries
					</motion.p>
				</div>
			</motion.div>
		</>
	);
};
