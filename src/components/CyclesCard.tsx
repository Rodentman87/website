import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { Starfield } from "./Starfield";

export const CyclesCard: React.FC<{
	starLayers: number;
	starsPerLayer: number;
	cyclesEntriesCount: number;
}> = ({ starLayers, starsPerLayer, cyclesEntriesCount }) => {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			whileHover={shouldReduceMotion ? "default" : "hover"}
			initial={"default"}
			className="rounded-md relative shadow-sm p-4 hover:shadow-md flex flex-col gap-2 text-gray-200 bg-gray-900 active:shadow-inner transition-shadow"
		>
			{[...Array(starLayers)].map((_, i) => (
				<motion.div
					variants={{
						default: {
							scale: 1,
						},
						hover: {
							scale: 1 + (i + 1) * 0.05,
							zIndex: i >= starLayers / 2 ? 100 : undefined,
						},
					}}
					transition={{ duration: 0.25 }}
					className="absolute w-full h-full top-0 left-0"
				>
					<Starfield starCount={starsPerLayer} />
				</motion.div>
			))}
			<div className="flex flex-row items-center gap-2 z-10">
				<motion.h3
					variants={{
						hover: {
							scale: 1.1,
							x: -5,
							y: -2,
						},
						default: { scale: 1, x: 0 },
					}}
					transition={{ duration: 0.25 }}
					layoutId="cycles-title"
					className="text-xl font-bold md:text-2xl backdrop-blur-sm px-1 rounded-md"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.01)",
					}}
				>
					Cycles
				</motion.h3>
			</div>
			<div className="flex flex-row sm:flex-row justify-between z-10">
				<motion.p
					variants={{
						hover: {
							scale: 1.05,
						},
						default: { scale: 1 },
					}}
					transition={{ duration: 0.25 }}
					className="m-0 backdrop-blur-sm px-1 rounded-md"
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
					transition={{ duration: 0.25 }}
					className="m-0 backdrop-blur-sm px-1 rounded-md"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.01)",
					}}
				>
					{cyclesEntriesCount} entries
				</motion.p>
			</div>
		</motion.div>
	);
};
