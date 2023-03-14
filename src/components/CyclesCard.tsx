import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";
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

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<>
			{isMounted && !shouldReduceMotion && (
				<Portal>
					<div
						onClick={(e) => e.stopPropagation()}
						className={clsx(
							"fixed top-0 left-0 z-0 w-screen h-screen transition-all duration-300 pointer-events-none",
							{
								"backdrop-blur-none": !isHovered,
								"backdrop-blur-sm": isHovered,
							}
						)}
					></div>
				</Portal>
			)}
			<motion.div
				onHoverStart={() => {
					setIsHovered(true);
					setShowAbove(true);
				}}
				onHoverEnd={() => setIsHovered(false)}
				onTransitionEnd={() => {
					if (isHovered === false) setShowAbove(false);
				}}
				whileHover={shouldReduceMotion ? "default" : "hover"}
				initial={"default"}
				className={clsx(
					"relative flex flex-col gap-2 p-4 text-gray-200 transition-all bg-gray-900 rounded-md shadow-sm hover:shadow-md active:shadow-inner",
					{
						"z-20": showAbove,
					}
				)}
			>
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
