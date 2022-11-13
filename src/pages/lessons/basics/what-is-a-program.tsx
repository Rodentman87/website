import { TutorialLayout } from "@components/tutorial-layout";
import { createHmac } from "crypto";
import { GetStaticProps } from "next";
import Content from "./what-is-a-program.mdx";

type PageProps = {
	title: string;
	description: string;
	courseName: string;
	lessonNumber: number;
	token: string;
};

export default function Post({
	title,
	description,
	courseName,
	lessonNumber,
	token,
}: PageProps) {
	return (
		<TutorialLayout
			title={title}
			description={description}
			courseName={courseName}
			lessonNumber={lessonNumber}
			token={token}
		>
			<Content />
		</TutorialLayout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const title = "What is a program?";
	const description =
		"Learning the basics of how computers and humans communicate";
	const courseName = "Basics";
	const lessonNumber = 1;
	const hmac = createHmac("sha256", process.env.SIGNING_SECRET);
	hmac.update(
		JSON.stringify({
			title,
			description,
			badgeLeft: courseName,
			badgeRight: "Lesson " + lessonNumber,
		})
	);
	const token = hmac.digest("hex");

	return {
		props: {
			title,
			description,
			courseName,
			lessonNumber,
			token,
		},
	};
};
