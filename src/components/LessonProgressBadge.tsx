import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import partialCircle from "svg-partial-circle";
import { IoIosSchool } from "react-icons/io";

interface LessonProgressBadgeProps {
	progress: number;
}

export const LessonProgressBadge: React.FC<LessonProgressBadgeProps> = ({
	progress,
}) => {
	const circlePath = useMemo(() => {
		return partialCircle(
			12,
			12,
			11,
			-Math.PI / 2,
			Math.PI * progress * 2 - Math.PI / 2
		)
			.map((c) => c.join(" "))
			.join(" ") as string;
	}, [progress]);

	const shouldReduceMotion = useReducedMotion();

	return (
		<div className="w-10 h-10 relative flex flex-row justify-center items-center">
			<svg viewBox="0 0 24 24" className="w-full h-full absolute top-0 left-0">
				<circle
					cx="12"
					cy="12"
					r="11"
					fill="none"
					stroke="#ccc"
					strokeWidth={2}
				/>
				<motion.path
					d={circlePath}
					fill="none"
					stroke="green"
					strokeLinecap="round"
					strokeWidth={2}
					initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1, delay: 0.5 }}
				/>
			</svg>
			<IoIosSchool />
		</div>
	);
};
