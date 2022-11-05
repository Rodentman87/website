import Head from "next/head";
import Layout from "../components/layout";

export default function CardmawPrivacyPolicy() {
	return (
		<Layout>
			<Head>
				<title>Colossal Cardmaw Terms of Service</title>
			</Head>
			<section>
				<h2>Colossal Cardmaw Terms of Service</h2>
				<p>
					By using Colossal Cardmaw, you agree to the following terms of
					service. You may not use Colossal Cardmaw to harass anyone or break
					any laws (not that I see how you could, but don't do it). You may not
					intentionally spam the bot with commands in an attempt to cause an
					outage. I reserve the right to block the bot from being used in any
					server (Don't worry, I wont do this unless the server is actively
					spamming the bot or otherwise causing issues). If you have any
					questions, you can contact me on discord.
				</p>
			</section>
		</Layout>
	);
}
