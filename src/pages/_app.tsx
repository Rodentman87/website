import { AudioLink } from "@components/AudioLink";
import { MDXProvider } from "@mdx-js/react";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ShikiContext } from "../components/ShikiProvider";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
	const [highlighter, setHighlighter] = useState(null);

	useEffect(() => {
		import("shiki").then((shiki) => {
			shiki.setCDN("https://unpkg.com/shiki/");
			shiki
				.getHighlighter({
					theme: "solarized-light",
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
				<AudioLink>
					<Component {...pageProps} />
				</AudioLink>
			</MDXProvider>
		</ShikiContext.Provider>
	);
}
