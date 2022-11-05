import Head from "next/head";
import Layout from "../components/layout";

export default function CardmawPrivacyPolicy() {
	return (
		<Layout>
			<Head>
				<title>Colossal Cardmaw Privacy Policy</title>
			</Head>
			<section>
				<h2>Colossal Cardmaw Privacy Policy</h2>
				<p>
					Colossal Cardmaw only collects the information necessary to retrieve
					and display any information that you request. No personal data is
					stored other than your discord user ID when you choose to show a card
					in chat. Additionally, Colossal Cardmaw contains a score tracking
					system for its available games, this system is entirely opt-in and the
					app will only store your user ID, the score, the info about what game
					you played, and when the game finished. If you have any questions, you
					can contact me on discord. Also, some completely anonymous performance
					data is collected to determine the length of time it takes to run
					commands. Lastly, when Colossal Cardmaw encounters an error, some
					basic contextual data is sent to me to help debug the issue, this data
					includes the command that was run, and the options selected.
				</p>
			</section>
		</Layout>
	);
}
