import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { StatusResponse } from "../ActivityCard";
import { useStatusKV } from "../StatusKVContext";

const colors = {
	primary: "#ecaa09",
	secondary: "#ebe6d7",
};

function mapToMapName(map: string) {
	switch (map) {
		case "dam_battlegrounds":
			return "Dam Battlegrounds";
		case "buried_city":
			return "Buried City";
		case "spaceport":
			return "The Spaceport";
		case "blue_gate":
			return "The Blue Gate";
		case "stella_montis":
			return "Stella Montis";
		default:
			return null;
	}
}

function mapToAsset(map: string) {
	switch (map) {
		case "dam_battlegrounds":
			return "https://arcraiders.wiki/w/images/thumb/a/a6/Dam_Battlegrounds.png/800px-Dam_Battlegrounds.png.webp";
		case "buried_city":
			return "https://arcraiders.wiki/w/images/thumb/8/80/Buried_City.png/800px-Buried_City.png.webp";
		case "spaceport":
			return "https://arcraiders.wiki/w/images/thumb/a/aa/Spaceport.png/800px-Spaceport.png.webp";
		case "blue_gate":
			return "https://arcraiders.wiki/w/images/thumb/4/4f/Blue_Gate.png/800px-Blue_Gate.png.webp";
		case "stella_montis":
			return "https://arcraiders.wiki/w/images/thumb/9/93/Stella_Montis.png/800px-Stella_Montis.png.webp";
		default:
			return null;
	}
}

export const ARCRaidersStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const gameId = "1808500";
	const kv = useStatusKV();

	const containerRef = React.useRef<HTMLDivElement>(null);
	const [imageWidth, setImageWidth] = React.useState(400);
	React.useLayoutEffect(() => {
		if (containerRef.current) {
			setImageWidth(containerRef.current.clientWidth);
		}
	}, [containerRef]);

	const steamLink = `https://store.steampowered.com/app/${gameId}/`;
	const largeImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/header.jpg`;

	const map = kv["arcm"];

	const shouldShowMap =
		status.details === "In Round" || status.details === "Matchmaking";

	const detailsLine = React.useMemo(() => {
		const mapName = mapToMapName(map);
		if (shouldShowMap && mapName != null) {
			return `${status.details} - ${mapName}`;
		} else {
			return status.details;
		}
	}, [map, status.details, shouldShowMap]);

	const mapImg = mapToAsset(map);

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
				className="absolute text-sm rounded-md -top-6 left-2 backdrop-blur-sm"
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
					/>
				</div>
			</motion.div>
			<div className="flex flex-row items-stretch justify-start gap-2 p-2 text-white transition-colors duration-500 bg-black bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70 overflow-clip">
				<img
					src="/ARC_Logo_Lines.svg"
					width={120}
					className="pl-1 -mt-2 -mb-2 -mr-6"
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
								className="ml-2 text-xs"
							>
								{detailsLine}
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
								className="ml-4 text-xs"
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
				{shouldShowMap && mapImg != null && (
					<motion.div
						key={map}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						style={{
							backgroundImage: `url(${mapImg})`,
							backgroundPosition: "center",
							backgroundSize: "cover",
							maskImage: "linear-gradient(to right, transparent, black)",
						}}
						className="absolute top-0 bottom-0 right-0 w-40 rounded-r-xl"
					/>
				)}
			</div>
		</motion.div>
	);
};

const LiveEventDisplay: React.FC = () => {
	// TODO figure out how I wanna do the real time event stuff, or even what I'd want to show
	return null;
	// const kv = useStatusKV();
	// const lastEvent = React.useRef<string>(kv["lastRlStat"]);
	// const [events, setEvents] = React.useState<string[]>([]);
	// const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	// useEffect(() => {
	// 	if (kv["lastRlStat"] !== lastEvent.current) {
	// 		lastEvent.current = kv["lastRlStat"];
	// 		const mappedName = EVENT_MAP[kv["lastRlStat"].split(";")[1]];
	// 		if (mappedName === undefined) return;
	// 		setEvents((prev) =>
	// 			[kv["lastRlStat"].split(";")[0] + ";" + mappedName, ...prev].slice(0, 3)
	// 		);
	// 		// Reset the timer to start clearing the events
	// 		if (timer.current) clearInterval(timer.current);
	// 		timer.current = setInterval(() => {
	// 			setEvents((prev) => prev.slice(0, prev.length - 1));
	// 		}, 10_000);
	// 	}
	// }, [kv]);

	// return (
	// 	<div className="flex flex-col-reverse justify-start gap-0.25 grow">
	// 		<AnimatePresence mode="popLayout">
	// 			{events.map((event, i) => (
	// 				<motion.div
	// 					key={event.split(";")[0]}
	// 					initial={{ opacity: 0, y: 8 }}
	// 					animate={{ opacity: 1 - i * 0.25, y: 0 }}
	// 					exit={{ opacity: 0, y: -8 }}
	// 					className="flex flex-row items-center gap-1 text-xs"
	// 				>
	// 					{event.split(";")[1]}
	// 				</motion.div>
	// 			))}
	// 		</AnimatePresence>
	// 	</div>
	// );
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
