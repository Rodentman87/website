import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Portal } from "react-portal";
import { FocusTrap } from "./FocusTrap";

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
	const firstFocusRef = React.useRef<HTMLButtonElement>(null);
	const lastFocusRef = React.useRef<HTMLAnchorElement>(null);

	return (
		<>
			<motion.button
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
					<motion.div layoutId={id + "-icon"} className={iconClassNames}>
						<Image
							alt={`${title} icon`}
							src={iconPath}
							width={32}
							height={32}
						/>
					</motion.div>
				)}
			</motion.button>
			{isExpanded && (
				<Portal>
					<FocusTrap
						firstFocusRef={firstFocusRef}
						lastFocusRef={lastFocusRef}
					/>
					<div
						onClick={() => setIsExpanded(false)}
						className="fixed top-0 left-0 z-50 flex flex-row items-center justify-center w-screen h-screen p-2 bg-black bg-opacity-25 backdrop-blur-sm"
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
									<motion.div
										layoutId={id + "-icon"}
										className={iconClassNames}
									>
										<Image
											alt={`${title} icon`}
											src={iconPath}
											width={32}
											height={32}
										/>
									</motion.div>
								)}
							</div>
							<p className="m-0">{description}</p>
							<div className="flex flex-row justify-between">
								<button
									onClick={() => setIsExpanded(false)}
									className="hover:underline focus:underline"
									ref={(el) => {
										if (el) el.focus();
										firstFocusRef.current = el;
									}}
								>
									Close
								</button>
								<a
									href={link}
									target="_blank"
									rel="noreferrer"
									className="text-sm font-bold"
									ref={lastFocusRef}
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
