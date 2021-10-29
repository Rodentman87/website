import { AnimateSharedLayout } from "framer-motion";
import "../styles/global.css";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AnimateSharedLayout type="switch">
			<Component {...pageProps} />
		</AnimateSharedLayout>
	);
}
