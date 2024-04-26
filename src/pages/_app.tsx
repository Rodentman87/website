import { AchievementGetDisplay } from "@components/AchievementGetDisplay";
import { AudioSystem } from "@components/AudioLink";
import { QuestRequirementsDisplay } from "@components/QuestRequirementsDisplay";
import { QuestScroll } from "@components/QuestScroll";
import { MDXProvider } from "@mdx-js/react";
import { Analytics } from "@vercel/analytics/react";
import { AchievementStore } from "achievements/AchievementStore";
import { AchievementStoreContext } from "hooks/useAchievementStore";
import { QuestStoreContext } from "hooks/useQuestStore";
import { AppProps } from "next/app";
import { QuestStore } from "quests/QuestStore";
import { useEffect, useState } from "react";
import { ShikiContext } from "../components/ShikiProvider";
import "../styles/global.css";

const achievementStore = new AchievementStore();
const questStore = new QuestStore();

export default function App({ Component, pageProps }: AppProps) {
	const [highlighter, setHighlighter] = useState(null);

	useEffect(() => {
		import("shiki").then((shiki) => {
			shiki
				.getHighlighter({
					themes: ["solarized-light"],
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
								backgroundColor: "#fdf6e3",
							}}
						>
							{children}
						</code>
					),
				}}
			>
				<AudioSystem>
					<AchievementStoreContext.Provider value={achievementStore}>
						<QuestStoreContext.Provider value={questStore}>
							<AchievementGetDisplay />
							<QuestRequirementsDisplay />
							<QuestScroll />
							<Component {...pageProps} />
							<Analytics />
						</QuestStoreContext.Provider>
					</AchievementStoreContext.Provider>
				</AudioSystem>
			</MDXProvider>
		</ShikiContext.Provider>
	);
}
