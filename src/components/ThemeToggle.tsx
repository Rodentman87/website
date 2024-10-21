import React, { createContext } from "react";

export const ThemeToggle: React.FC<{
	dark: boolean;
	setDarkMode: (value: boolean) => void;
}> = ({ dark, setDarkMode }) => {
	return (
		<div className="fixed top-2 right-2">
			<button
				onClick={() => {
					setDarkMode(!dark);
				}}
			>
				{dark ? "🌚" : "🌞"}
			</button>
		</div>
	);
};

export const ThemeContext = createContext({ dark: false });
