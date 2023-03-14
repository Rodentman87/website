import Head from "next/head";
import Layout from "../components/layout";
import { ScriptedCode } from "../components/ScriptedCode/ScriptedCode";

const testCode = `
console.log("test");
const a = "test";
const b = 2;
`.trim();

export default function CardmawPrivacyPolicy() {
	return (
		<Layout>
			<Head>
				<title>Test Page</title>
			</Head>
			<p>This page works best on desktop.</p>
			<ScriptedCode
				code={testCode}
				id="test"
				language="typescript"
				script={[
					{
						indicateLine: 1,
					},
					{
						indicateLine: 2,
						variables: {
							a: "test",
						},
					},
					{
						indicateLine: 3,
						variables: {
							a: "test",
							b: 2,
						},
					},
				]}
			/>
		</Layout>
	);
}
