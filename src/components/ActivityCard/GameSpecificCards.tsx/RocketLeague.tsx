import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useEffect } from "react";
import {
	COLOR_CONRTAST_MINIMUM,
	CONTRAST_AGAINST,
	StatusResponse,
} from "../ActivityCard";
import { useStatusKV } from "../StatusKVContext";

interface Colors {
	primary: string;
	secondary: string;
}

export const RocketLeagueStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const gameId = "252950";
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

	if (!gameId) return null; // Not a game we have info for, add simplified card later

	const steamLink = `https://store.steampowered.com/app/${gameId}/`;
	const coverImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/library_600x900_2x.jpg`;
	const largeImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/header.jpg`;

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
				I'm currently playing:
			</motion.span>
			<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
				<div className="absolute top-0 left-0 translate-x-1">
					<SmoothSwapImage
						key={imageWidth}
						width={imageWidth}
						height={imageWidth}
						alt=""
						src={largeImage}
						className=""
						onLoad={async (e) => {
							await new Promise((resolve) => setTimeout(resolve, 250));
							const colors = await extractColors(
								coverImage,
								e.target as HTMLImageElement
							);
							const bestColors = getBestColors(
								colors,
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
			<div className="flex flex-row items-stretch justify-start gap-2 p-2 text-white transition-colors duration-500 bg-black bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70">
				<SmoothSwapImage
					alt={status.name}
					width={64}
					height={64}
					src={coverImage}
					className="rounded-lg shadow-md"
				/>
				<div className="flex flex-col justify-start min-w-0 grow">
					<AnimatePresence mode="popLayout">
						<motion.a
							key={status.name}
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
							title={status.name}
							className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
							target="_blank"
							href={steamLink}
						>
							{status.name}
						</motion.a>
						{status.details && (
							<motion.span
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
								{status.details}
							</motion.span>
						)}
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
								{status.state}{" "}
								<AnimatePresence>
									{status.party && status.party.size && (
										<>
											(
											<motion.span
												key="current"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
											>
												{status.party.size[0]}
											</motion.span>{" "}
											of{" "}
											<motion.span
												key="max"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
											>
												{status.party.size[1]}
											</motion.span>
											)
										</>
									)}
								</AnimatePresence>
							</motion.span>
						)}
					</AnimatePresence>
					<LiveEventDisplay />
				</div>
			</div>
		</motion.div>
	);
};

const EVENT_MAP = {
	Goal: "Scored a goal!",
	Shot: "Took a shot!",
	Save: "Made a save!",
	Demolish: "Demo'd an opponent!",
	Assist: "Got an assist!",
	Center: "Centered the ball!",
	Clear: "Cleared the ball!",
	Win: "Won the game!",
	HatTrick: "Got a hat trick!",
	EpicSave: "Made an epic save!",
	FirstTouch: "Got the first touch!",
};

const LiveEventDisplay: React.FC = () => {
	const kv = useStatusKV();
	const lastEvent = React.useRef<string>(kv["lastRlStat"]);
	const [events, setEvents] = React.useState<string[]>([]);

	useEffect(() => {
		if (kv["lastRlStat"] !== lastEvent.current) {
			lastEvent.current = kv["lastRlStat"];
			const mappedName = EVENT_MAP[kv["lastRlStat"].split(";")[1]];
			if (mappedName === undefined) return;
			setEvents((prev) =>
				[kv["lastRlStat"].split(";")[0] + ";" + mappedName, ...prev].slice(0, 3)
			);
		}
	}, [kv]);

	return (
		<div className="flex flex-col-reverse justify-start gap-0.25 grow">
			{events.map((event, i) => (
				<motion.div
					key={event.split(";")[0]}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1 - i * 0.25, x: 0 }}
					exit={{ opacity: 0, x: -10 }}
					className="flex flex-row items-center gap-1 text-xs"
				>
					{event.split(";")[1]}
				</motion.div>
			))}
		</div>
	);
};

const SmoothSwapImage = React.forwardRef<
	HTMLDivElement,
	{
		src: string;
		className: string;
		alt?: string;
		width?: number;
		height?: number;
		onLoad?: React.ReactEventHandler<HTMLImageElement>;
	}
>(({ src, onLoad, width, height, alt, className }, ref) => {
	const [oldSrc, setOldSrc] = React.useState(src);
	const [showOldImage, setShowOldImage] = React.useState(true);

	return (
		<div className="relative shrink-0" ref={ref}>
			<Image
				alt={alt}
				width={width}
				height={height}
				src={src}
				className={className}
				onLoad={(e) => {
					// Fade out old image
					setShowOldImage(false);
					onLoad?.(e);
				}}
			/>
			<AnimatePresence
				onExitComplete={() => {
					setOldSrc(src);
					// We set it to show old true right now, but this will actually be the new image, we just need to make sure it's ready
					setShowOldImage(true);
				}}
			>
				{showOldImage && (
					<motion.div
						initial={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
						className="absolute top-0 bottom-0 left-0 right-0 z-10"
					>
						<Image
							alt=""
							width={width}
							height={height}
							src={oldSrc}
							className={className}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
});

function msToMinutesAndSeconds(ms: number) {
	const hours = Math.floor(ms / 3600000);
	const minutes = padLeft(Math.floor((ms % 3600000) / 60000).toString(), 2);
	const seconds = padLeft(Math.floor((ms % 60000) / 1000).toString(), 2);
	return `${hours}:${minutes}:${seconds}`;
}

function padLeft(str: string, size: number) {
	let s = str;
	while (s.length < size) s = "0" + s;
	return s;
}
