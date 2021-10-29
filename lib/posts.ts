import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import html from "remark-html";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, "");

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...matterResult.data,
		};
	});
	// Sort posts by date
	return allPostsData.sort((a: any, b: any) => {
		if (a.pinned && !b.pinned) return -1;
		if (b.pinned && !a.pinned) return 1;
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);

	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ""),
			},
		};
	});
}

export async function getPostData(id) {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	const processedContent = await unified()
		.use(remarkParse)
		.use(html)
		.use(remarkGfm)
		.use(remarkToc)
		.use(remarkRehype)
		.use(rehypeHighlight)
		.use(remarkStringify)
		.process(matterResult.content);
	const contentHtml = processedContent.toString();

	// Combine the data with the id and contentHtml
	return {
		id,
		contentHtml,
		...matterResult.data,
	};
}
