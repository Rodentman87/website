import React from "react";

export const FancyText: React.FC<{ children: string }> = ({ children }) => {
	return (
		<span className="bg-stone-100 px-1 rounded-md hover:scale-110 transition-transform inline-block">
			<span className="from-purple-500 to-orange-400 bg-gradient-to-r bg-clip-text text-transparent font-bold">
				{children}
			</span>
		</span>
	);
};