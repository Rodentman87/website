import { CursorSkinStore } from "modules/cursor-skins/CursorSkinStore";
import { CursorSkinStoreContext } from "modules/cursor-skins/hooks/useCursorSkinStore";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang={"en"}>
				<Head>
					<meta name="theme-color" content="#fdf6e3" />
					<meta name="darkreader-lock" />
				</Head>
				<body>
					<CursorSkinStoreContext.Provider value={new CursorSkinStore()}>
						<Main />
						<NextScript />
					</CursorSkinStoreContext.Provider>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
