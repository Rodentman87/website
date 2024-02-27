import remarkGfm from "remark-gfm";
import nextmdx from "@next/mdx";

const withMDX = nextmdx({
	extension: /\.mdx?$/,
	options: {
		// If you use remark-gfm, you'll need to use next.config.mjs
		// as the package is ESM only
		// https://github.com/remarkjs/remark-gfm#install
		remarkPlugins: [remarkGfm],
		rehypePlugins: [],
		providerImportSource: "@mdx-js/react",
	},
});
export default withMDX({
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				port: "",
				pathname: "/image/**",
			},
			{
				protocol: "https",
				hostname: "cdn.cloudflare.steamstatic.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.akamai.steamstatic.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.watchdis.tv",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.ytimg.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				port: "",
				pathname: "/**",
			},
		],
	},
});
