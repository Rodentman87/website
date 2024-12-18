import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { DieRollState } from "./ActivityCard";

export const DieRollStatus: React.FC<{
	status: DieRollState;
}> = ({ status }) => {
	const [previousRolls, setPreviousrolls] = React.useState<
		{ roll: number; id: number }[]
	>([]);

	useEffect(() => {
		if (status.state === "rolled") {
			if (previousRolls.length > 0 && status.time === previousRolls[0].id)
				return; // Prevent duplicate rolls
			const nextRolls = [...previousRolls];

			nextRolls.unshift({ roll: status.value, id: status.time });
			if (nextRolls.length > 3) {
				nextRolls.pop();
			}
			setPreviousrolls(nextRolls);
		}
	}, [status]);

	return (
		<motion.div
			key="die-roll"
			layout
			initial={{ opacity: 0, x: -25 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -25 }}
			className="relative mt-8 border border-gray-500 border-solid shadow-md rounded-2xl w-96 group"
		>
			<motion.span
				className="absolute text-sm rounded-md -top-6 left-2 backdrop-blur-sm"
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1 }}
			>
				I'm currently rolling some dice!
			</motion.span>
			<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
				<div className="absolute top-0 left-0 translate-x-1"></div>
			</motion.div>
			<div className="relative flex flex-row items-stretch justify-start gap-2 p-2 text-white transition-colors duration-500 bg-gradient-to-br from-purple-700 to-blue-700 backdrop-blur-xl rounded-2xl">
				<div className="flex flex-col justify-start min-w-0 grow min-h-[56px]">
					<AnimatePresence mode="popLayout">
						{status.state === "rolling" && (
							<motion.span
								className="text-xs"
								initial={{
									x: -5,
									opacity: 0,
								}}
								animate={{
									x: 0,
									opacity: 1,
								}}
							>
								Rolling a D20...
							</motion.span>
						)}
						{previousRolls
							.slice(0, status.state === "rolling" ? 2 : 3)
							.map(({ roll, id }, index) => (
								<motion.span
									className="text-xs"
									key={id}
									initial={{
										x: -5,
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1 - index * 0.2,
									}}
									exit={{
										x: -5,
										opacity: 0,
									}}
								>
									Rolled {roll}
								</motion.span>
							))}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};
