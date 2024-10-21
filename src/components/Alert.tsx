import React from "react";

export const Alert: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className="p-2 text-black border-2 rounded-md bg-amber-100 border-amber-400">
			{children}
		</div>
	);
};
