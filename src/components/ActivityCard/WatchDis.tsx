import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React from "react";
import {
	COLOR_CONRTAST_MINIMUM,
	CONTRAST_AGAINST,
	StatusResponse,
} from "./ActivityCard";

interface Colors {
	primary: string;
	secondary: string;
}

export const WatchDisStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	console.log(status);
	const [colors, setColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [imageWidth, setImageWidth] = React.useState(400);
	React.useLayoutEffect(() => {
		if (containerRef.current) {
			setImageWidth(containerRef.current.clientWidth);
		}
	}, [containerRef]);

	const [imageSize, setImageSize] = React.useState({ width: 64, height: 96 });

	const imageLink = React.useMemo(() => {
		const [, query, base] = /mp:external\/.*?\/(.*?)?\/?https\/(.*)/.exec(
			status.assets.large_image
		);
		return `https://${base}${query ? decodeURIComponent(query) : ""}`;
	}, [status.assets.large_image]);

	const name = status.name === "YouTube" ? status.details : status.name;

	return (
		<motion.div
			key="game"
			layout
			ref={containerRef}
			initial={{ opacity: 0, x: -25 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -25 }}
			className="relative mt-8 border border-gray-500 border-solid shadow-md rounded-2xl w-96 group"
		>
			<motion.span
				className="absolute text-sm -top-6 left-2"
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1 }}
			>
				I'm currently watching:
			</motion.span>
			<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
				<div className="absolute top-0 left-0 translate-x-1">
					<SmoothSwapImage
						key={imageWidth}
						width={imageWidth}
						height={imageWidth}
						alt=""
						src={imageLink}
						className=""
						onLoad={async (e) => {
							await new Promise((resolve) => setTimeout(resolve, 250));
							const newColors = await extractColors(
								imageLink,
								e.target as HTMLImageElement
							);
							const bestColors = getBestColors(
								newColors,
								CONTRAST_AGAINST,
								COLOR_CONRTAST_MINIMUM
							);
							setColors({
								primary: bestColors.primary.hex(),
								secondary: bestColors.secondary.hex(),
							});
						}}
					/>
				</div>
			</motion.div>
			<div className="relative flex flex-row items-stretch justify-start gap-2 p-2 transition-colors duration-500 bg-black bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70">
				<div className="absolute top-2 left-2">
					<SmoothSwapImage
						autoWidth
						alt={name}
						width={180}
						height={96}
						src={imageLink}
						className="rounded-lg shadow-md"
						onLoad={(e) => {
							setImageSize({
								width: e.currentTarget.width,
								height: e.currentTarget.height,
							});
						}}
					/>
				</div>
				<div
					style={{
						flexShrink: 0,
						width: imageSize.width,
						height: imageSize.height,
					}}
				/>
				<div className="flex flex-col justify-start min-w-0 grow">
					<AnimatePresence mode="popLayout">
						<motion.span
							key={name}
							initial={{
								x: -10,
								opacity: 0,
							}}
							animate={{
								x: 0,
								color: colors.secondary,
								opacity: 1,
							}}
							exit={{
								x: 10,
								opacity: 0,
							}}
							title={name}
							className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
						>
							{name}
						</motion.span>
						{status.state && (
							<motion.span
								key={status.state}
								initial={{
									x: -10,
									opacity: 0,
								}}
								animate={{
									x: 0,
									color: colors.primary,
									opacity: 1,
								}}
								exit={{
									x: 10,
									opacity: 0,
								}}
								className="text-xs"
							>
								{status.state}
							</motion.span>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};

const SmoothSwapImage: React.FC<{
	src: string;
	className: string;
	autoWidth?: boolean;
	alt?: string;
	width?: number;
	height?: number;
	onLoad?: React.ReactEventHandler<HTMLImageElement>;
}> = ({ src, onLoad, autoWidth, width, height, alt, className }) => {
	return (
		<div className="relative">
			<AnimatePresence mode="popLayout">
				<motion.div
					key={src}
					initial={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
				>
					<Image
						alt={alt}
						width={width}
						height={height}
						src={src}
						style={{
							width: autoWidth ? "auto" : undefined,
							maxHeight: height,
							objectFit: "contain",
						}}
						className={className}
						onLoad={(e) => {
							onLoad?.(e);
						}}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
