import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";
import { Portal } from "react-portal";

interface ProjectCardProps {
	id: string;
	title: string;
	description: string;
	cardClassNames?: string;
	iconPath?: string;
	iconClassNames?: string;
	brandColor: string;
	dark?: boolean;
	link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
	id,
	title,
	description,
	cardClassNames,
	iconPath,
	iconClassNames,
	brandColor,
	dark,
	link,
}) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	return (
		<>
			<motion.div
				onClick={() => setIsExpanded(true)}
				layoutId={id}
				style={{
					backgroundColor: brandColor,
				}}
				className={clsx(
					"relative flex flex-row items-center justify-between gap-2 p-4 transition-shadow rounded-md shadow-sm cursor-pointer hover:shadow-md",
					cardClassNames ?? "",
					{
						"text-black": !dark,
						"text-white": dark,
					}
				)}
			>
				<motion.span layoutId={id + "-title"}>{title}</motion.span>
				{iconPath && (
					<motion.img
						layoutId={id + "-icon"}
						src={iconPath}
						width={32}
						className={iconClassNames}
					/>
				)}
			</motion.div>
			{isExpanded && (
				<Portal>
					<div
						onClick={() => setIsExpanded(false)}
						className="fixed top-0 left-0 z-50 flex flex-row items-center justify-center w-screen h-screen p-2 bg-black bg-opacity-25"
					>
						<motion.div
							onClick={(e) => e.stopPropagation()}
							layoutId={id}
							style={{
								backgroundColor: brandColor,
							}}
							className={clsx(
								"relative flex flex-col gap-2 p-4 rounded-md w-96",
								cardClassNames ?? "",
								{
									"text-black": !dark,
									"text-white": dark,
								}
							)}
						>
							<div className="flex flex-row items-center justify-between">
								<motion.span
									layoutId={id + "-title"}
									className="text-lg font-bold"
								>
									{title}
								</motion.span>
								{iconPath && (
									<motion.img
										layoutId={id + "-icon"}
										src={iconPath}
										width={32}
										className={iconClassNames}
									/>
								)}
							</div>
							<p className="m-0">{description}</p>
							<div className="flex flex-row justify-end">
								<a
									href={link}
									target="_blank"
									rel="noreferrer"
									className="text-sm font-bold"
								>
									Project link
								</a>
							</div>
						</motion.div>
					</div>
				</Portal>
			)}
		</>
	);
};
