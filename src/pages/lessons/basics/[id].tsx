import { Alert } from "@components/Alert";
import { TutorialLayout } from "@components/tutorial-layout";
import { createHmac } from "crypto";
import { readdir } from "fs/promises";
import { GetStaticProps } from "next";
import lesson0 from "./lesson-0.mdx";
import whatIsAProgram from "./what-is-a-program.mdx";
import howToReadAProgram from "./how-to-read-a-program.mdx";
import problemSolvingForComputers from "./problem-solving-for-computers.mdx";
import React from "react";

const pages = {
	"lesson-0.mdx": lesson0,
	"what-is-a-program.mdx": whatIsAProgram,
	"how-to-read-a-program.mdx": howToReadAProgram,
	"problem-solving-for-computers.mdx": problemSolvingForComputers,
};

type PageProps = {
	title: string;
	description: string;
	courseName: string;
	lessonNumber: number;
	token: string;
	fileName: string;
	nextLesson?: string;
};

export default function Post({
	title,
	description,
	courseName,
	lessonNumber,
	nextLesson,
	token,
	fileName,
}: PageProps) {
	const Component = pages[fileName];

	return (
		<TutorialLayout
			title={title}
			description={description}
			courseName={courseName}
			courseSlug="basics"
			lessonNumber={lessonNumber}
			token={token}
			nextLesson={nextLesson}
		>
			<br />
			<Alert>This page works best on desktop or tablet</Alert>
			<Component />
		</TutorialLayout>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { id } = params;
	const page = await import(`./${id}.mdx`);
	const title = page.meta.title;
	const description = page.meta.description;
	const nextLesson = page.meta.nextLesson ?? null;
	const courseName = "Basics";
	const lessonNumber = page.meta.lessonNumber;
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
			fileName: `${id}.mdx`,
			nextLesson,
		},
	};
};

export async function getStaticPaths() {
	// Return a list of possible value for id
	const paths = await (
		await readdir(process.cwd() + "/src/pages/lessons/basics")
	)
		.filter((file) => !file.startsWith("[") && !file.startsWith("index"))
		.map((file) => file.replace(/\..*?$/, ""))
		.map((file) => "/lessons/basics/" + file);

	return {
		paths,
		fallback: false,
	};
}
