import React from "react";

export const IntroQuote: React.FC<{ children: string }> = ({ children }) => {
	return (
		<div className="p-4 mx-16 border-t border-b border-blue-400 text-center italic text-blue-600">
			{children}
		</div>
	);
};
