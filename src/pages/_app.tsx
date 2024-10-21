import { AchievementGetDisplay } from "@components/AchievementGetDisplay";
import { AudioSystem } from "@components/AudioLink";
import { ThemeContext, ThemeToggle } from "@components/ThemeToggle";
import { MDXProvider } from "@mdx-js/react";
import { Analytics } from "@vercel/analytics/react";
import { AchievementStore } from "achievements/AchievementStore";
import { AchievementStoreContext } from "hooks/useAchievementStore";
import { AppProps } from "next/app";
import { useEffect, useLayoutEffect, useState } from "react";
import { HighlighterGeneric } from "shiki";
import { ShikiContext } from "../components/ShikiProvider";
import "../styles/global.css";

const achievementStore = new AchievementStore();

export default function App({ Component, pageProps, router }: AppProps) {
	const [highlighter, setHighlighter] =
		useState<HighlighterGeneric<string, string>>(null);
	const [darkMode, setDarkMode] = useState(false);
	useLayoutEffect(() => {
		// Run this in a layout effect to prevent a flash of light mode
		const darkModeFromMedia = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		const keyInStorageSet = localStorage.getItem("darkMode") !== null;
		const darkModeFromLocalStorage =
			localStorage.getItem("darkMode") === "true";
		setDarkMode(keyInStorageSet ? darkModeFromLocalStorage : darkModeFromMedia);
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("darkMode", "true");
			if (highlighter) highlighter.setTheme("solarized-dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("darkMode", "false");
			if (highlighter) highlighter.setTheme("solarized-light");
		}
	}, [darkMode, highlighter]);

	useEffect(() => {
		import("shiki").then((shiki) => {
			shiki
				.getHighlighter({
					themes: ["solarized-light", "solarized-dark"],
					langs: ["typescript", "javascript", "json"],
				})
				.then((highlighter) => {
					setHighlighter(highlighter);
				});
		});
	}, []);

	return (
		<ShikiContext.Provider value={highlighter}>
			<MDXProvider
				components={{
					code: ({ children }) => (
						<code
							className="px-1 rounded-sm"
							style={{
								backgroundColor: darkMode ? "#002b36" : "#fdf6e3",
							}}
						>
							{children}
						</code>
					),
				}}
			>
				<AudioSystem>
					<AchievementStoreContext.Provider value={achievementStore}>
						<ThemeContext.Provider value={{ dark: darkMode }}>
							<ThemeToggle dark={darkMode} setDarkMode={setDarkMode} />
							<AchievementGetDisplay />
							<Component {...pageProps} />
							<Analytics />
						</ThemeContext.Provider>
					</AchievementStoreContext.Provider>
				</AudioSystem>
			</MDXProvider>
		</ShikiContext.Provider>
	);
}
