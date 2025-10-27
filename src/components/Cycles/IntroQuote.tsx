import clsx from "clsx";
import React from "react";

export const IntroQuote: React.FC<{ children: string; blur?: boolean }> = ({
	children,
	blur,
}) => {
	const [showEffect, setShowEffect] = React.useState(true);

	return (
		<div
			onClick={() => setShowEffect((old) => !old)}
			className={clsx(
				"p-4 mx-16 border-t border-b border-blue-400 text-center italic text-blue-600",
				{
					"blur-sm hover:blur-none transition-all": blur && showEffect,
				}
			)}
		>
			{children}
		</div>
	);
};
