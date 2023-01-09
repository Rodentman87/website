import Layout from "@components/layout";
import { createHmac } from "crypto";
import { readFile } from "fs/promises";
import Head from "next/head";
import { join } from "path";

interface License {
	department: string;
	relatedTo: string;
	name: string;
	licensePeriod: string;
	material: string;
	licenseType: string;
	link: string;
	remoteVersion: string;
	installedVersion: string;
	definedVersion: string;
	author: string;
}

export default function Licenses({
	licenses,
	metadata,
}: {
	licenses: License[];
	metadata: any;
}) {
	const params = new URLSearchParams();
	params.append("title", metadata.title);
	params.append("description", metadata.description);
	params.append("token", metadata.token);

	return (
		<Layout>
			<Head>
				<title>{metadata.title}</title>
				<meta name="og:title" content={metadata.title} />
				<meta name="og:description" content={metadata.description} />
				<meta name="og:type" content="article" />
				<meta
					name="og:image"
					content={"/api/post-image?" + params.toString()}
				/>
				<meta name="og:image:width" content="1200" />
				<meta name="og:image:height" content="630" />
				<meta name="og:author:first_name" content="Maisy" />
				<meta name="og:author:last_name" content="Dinosaur" />
				<meta name="og:author:username" content="rodentman87" />
				<meta name="og:author:gender" content="female" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@rodentman87" />
				<meta name="twitter:title" content={metadata.title} />
				<meta name="twitter:description" content={metadata.description} />
				<meta
					name="twitter:image"
					content={"/api/post-image?" + params.toString()}
				/>
			</Head>
			<article>
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl">Licenses</h1>
					<p>
						This site uses the following software and libraries. Click or tap
						one of the cards to view the repository.
					</p>
				</div>
				<div className="flex flex-col gap-2">
					{licenses.map((license) => (
						<a
							key={license.link}
							className="text-black no-underline"
							href={license.link.replace("git+", "").replace("ssh://", "")}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Open Github repo for ${license.name}`}
						>
							<div className="rounded-md shadow-md bg-white p-2 hover:shadow-lg transition-shadow">
								<div className="flex flex-row justify-between items-center">
									<h2 className="text-2xl">{license.name}</h2>
									<p className="m-0">{license.installedVersion}</p>
								</div>
								<div className="flex flex-row justify-between items-center">
									<p className="m-0">{license.licenseType}</p>
									<p className="m-0">{license.licensePeriod}</p>
								</div>
							</div>
						</a>
					))}
				</div>
			</article>
		</Layout>
	);
}

export async function getStaticProps() {
	const hmac = createHmac("sha256", process.env.SIGNING_SECRET);
	hmac.update(
		JSON.stringify({
			title: "Licenses",
			description:
				"A list of licenses for software and libraries used on this site.",
		})
	);
	const token = hmac.digest("hex");

	const licenses = await readFile(
		join(__dirname, "../../../licenses.json"),
		"utf8"
	);

	return {
		props: {
			licenses: JSON.parse(licenses),
			metadata: {
				token,
				title: "Licenses",
				description:
					"A list of licenses for software and libraries used on this site.",
			},
		},
	};
}
