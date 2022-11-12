import React from "react";

export const Alert: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className="p-2 bg-amber-100 border-amber-400 rounded-md border-2">
			{children}
		</div>
	);
};
