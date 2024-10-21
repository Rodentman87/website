import React from "react";

export const FancyText: React.FC<{ children: string }> = ({ children }) => {
	return (
		<span className="bg-white dark:bg-[#260131] rounded-md hover:scale-110 transition-transform inline-block">
			<span className="font-bold text-transparent from-purple-500 to-orange-400 bg-gradient-to-r bg-clip-text">
				{children}
			</span>
		</span>
	);
};
