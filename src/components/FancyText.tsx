import React from "react";

export const FancyText: React.FC<{ children: string }> = ({ children }) => {
	return (
		<span className="bg-white rounded-md hover:scale-110 transition-transform inline-block">
			<span className="from-purple-500 to-orange-400 bg-gradient-to-r bg-clip-text text-transparent font-bold">
				{children}
			</span>
		</span>
	);
};
