import {
	FloatingArrow,
	ReferenceType,
	arrow,
	offset,
	shift,
	useFloating,
	useHover,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export interface TooltipProps {
	content: string;
	children: (ref: React.MutableRefObject<ReferenceType>) => React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const arrowRef = React.useRef(null);
	const { refs, floatingStyles, context } = useFloating({
		placement: "top",
		strategy: "fixed",
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [
			shift(),
			offset(7 + 2),
			arrow({
				element: arrowRef,
			}),
		],
	});

	useHover(context);

	return (
		<>
			{children(refs.setReference as any)}
			<AnimatePresence>
				{isOpen && content && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						ref={refs.setFloating}
						className="fixed z-50 px-2 py-1 text-xs bg-white border border-gray-200 border-solid rounded-md shadow-md whitespace-nowrap"
						style={floatingStyles}
					>
						{content}
						<FloatingArrow ref={arrowRef} context={context} fill="white" />
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
