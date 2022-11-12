import { AnimateSharedLayout } from "framer-motion";
import "../styles/global.css";
import { AppProps } from "next/app";
import { ShikiContext } from "../components/ShikiProvider";
import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";

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
			<AnimateSharedLayout type="switch">
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
					<Component {...pageProps} />
				</MDXProvider>
			</AnimateSharedLayout>
		</ShikiContext.Provider>
	);
}
