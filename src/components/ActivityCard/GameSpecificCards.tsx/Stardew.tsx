import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useMemo } from "react";
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

export const StardewStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const gameId = "413150";
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
					</AnimatePresence>
					<GameStateDisplay />
				</div>
			</div>
		</motion.div>
	);
};

interface StardewInfo {
	coinCount: number;
	seasonIndex: number;
	dayOfMonth: number;
	time: number;
	weatherIcon: number;
	maxEnergy: number;
	currentEnergy: number;
	maxHealth: number;
	currentHealth: number;
	year: number;
}

const dayOfWeek = {
	0: "Sun.",
	1: "Mon.",
	2: "Tue.",
	3: "Wed.",
	4: "Thu.",
	5: "Fri.",
	6: "Sat.",
};

const weatherIconMap = {
	0: { file: "wedding", name: "Wedding Day" },
	1: { file: "festival", name: "Festival" },
	2: { file: "sun", name: "Sunny" },
	3: { file: "wind_spring", name: "Windy" },
	4: { file: "rain", name: "Rain" },
	5: { file: "storm", name: "Storm" },
	6: { file: "wind_fall", name: "Windy" },
	7: { file: "snow", name: "Snow" },
	999: { file: "green_rain", name: "Green Rain" },
};

const seasonMap = {
	0: "Spring",
	1: "Summer",
	2: "Fall",
	3: "Winter",
};

const STARDEW_MAX_ENERGY = 588;
const GameStateDisplay: React.FC = () => {
	const kv = useStatusKV();

	const stardewInfo = useMemo(() => {
		const parsed = JSON.parse(kv["stardew"] ?? "{}");
		if (Object.keys(parsed).length === 0) return null;
		return parsed as StardewInfo;
	}, [kv]);

	const parsedTime = useMemo(() => {
		if (!stardewInfo) return null;
		const [hours, minutes] = stardewInfo.time
			.toString()
			.padStart(4, "0")
			.match(/.{1,2}/g) ?? ["00", "00"];
		if (parseInt(hours) > 12) {
			return {
				hours: (parseInt(hours) - 12).toString(),
				minutes: minutes,
				am: false,
			};
		} else {
			return {
				hours: hours,
				minutes: minutes,
				am: true,
			};
		}
	}, [stardewInfo]);
	if (!stardewInfo) return null;

	return (
		<div className="flex flex-row justify-between">
			<div className="flex flex-col justify-end">
				{/* Energy */}
				<div className="flex flex-row items-center text-xs">
					<img src="/stardew/energy.png" className="inline" width={20} />
					<motion.div
						className="relative h-2 bg-gray-600 rounded-full"
						animate={{
							width: (stardewInfo.maxEnergy / STARDEW_MAX_ENERGY) * 250,
						}}
					>
						<motion.div
							className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
							animate={{
								width: (stardewInfo.currentEnergy / STARDEW_MAX_ENERGY) * 250,
							}}
						/>
					</motion.div>
				</div>

				{/* Health */}
				<div className="flex flex-row items-center text-xs">
					<img src="/stardew/health.png" className="inline" width={20} />
					<motion.div
						className="relative h-2 bg-gray-600 rounded-full"
						animate={{
							width: stardewInfo.maxHealth,
						}}
					>
						<motion.div
							className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
							animate={{
								width: stardewInfo.currentHealth,
							}}
						/>
					</motion.div>
				</div>
				<div className="flex flex-row text-xs align-baseline">
					<img src="/stardew/gold.png" className="inline" width={20} />
					<span>{stardewInfo.coinCount}g</span>
				</div>
			</div>
			<div className="flex flex-col justify-end gap-0.25 grow items-end pr-1">
				<p className="m-0 text-xs">
					{dayOfWeek[stardewInfo.dayOfMonth % 7]} {stardewInfo.dayOfMonth}, Year{" "}
					{stardewInfo.year}
				</p>
				<div className="flex flex-row gap-1">
					<SmoothSwapImage
						src={`/stardew/weather/${
							weatherIconMap[stardewInfo.weatherIcon].file
						}.bmp`}
						alt={weatherIconMap[stardewInfo.weatherIcon].name}
						width={36}
						height={25}
						className="my-0.5"
					/>
					<SmoothSwapImage
						src={`/stardew/season/${seasonMap[stardewInfo.seasonIndex]}.bmp`}
						alt={seasonMap[stardewInfo.seasonIndex]}
						width={36}
						height={25}
						className="my-0.5"
					/>
				</div>
				<p className="m-0 text-xs">
					{parsedTime.hours}:{parsedTime.minutes} {parsedTime.am ? "AM" : "PM"}
				</p>
			</div>
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
				title={alt}
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
							title={alt}
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
