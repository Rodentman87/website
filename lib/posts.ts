import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readTime from "read-time";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.mdx$/, "");

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
				id: fileName.replace(/\.mdx$/, ""),
			},
		};
	});
}

export async function getPostData(
	id
): Promise<{ content: string; metadata: Record<string, any> }> {
	const fullPath = path.join(postsDirectory, `${id}.mdx`);
	const fileContents = fs.readFileSync(fullPath, "utf8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);
	const readtime = readTime(fileContents).text;

	// Combine the data with the id and contentHtml
	return {
		content: matterResult.content,
		metadata: {
			id,
			...matterResult.data,
			readtime,
		},
	};
}
