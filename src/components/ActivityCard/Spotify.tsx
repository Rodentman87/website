import { useRive } from "@rive-app/react-canvas";
import { Track } from "@spotify/web-api-ts-sdk";
import clsx from "clsx";
import {
	AnimatePresence,
	Transition,
	animate,
	motion,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import memoize from "lodash.memoize";
import Image from "next/image";
import React, { useEffect, useLayoutEffect } from "react";
import { BsSpotify } from "react-icons/bs";
import {
	COLOR_CONRTAST_MINIMUM,
	CONTRAST_AGAINST,
	StatusResponse,
} from "./ActivityCard";
import styles from "./Spotify.module.css";
import { CassetteStatus } from "./SpotifyCard/CassetteStatus";

interface Colors {
	primary: string;
	secondary: string;
}

const TRANSITION_CONFIG: Transition = {
	duration: 0.5,
	ease: "anticipate",
};
const SWAP_TRANSITION_CONFIG: Transition = {
	delay: TRANSITION_CONFIG.duration + 0.1,
};

const SongNameAnimationInitial = {
	x: -10,
	opacity: 0,
};
const SongNameAnimationAnimate = memoize((color: string) => ({
	x: 0,
	color: color,
	opacity: 1,
}));
const SongNameAnimationExit = {
	x: 10,
	opacity: 0,
	transition: SWAP_TRANSITION_CONFIG,
};

export const SpotifyStatus: React.FC<{
	song: Track;
	status: StatusResponse;
}> = ({ song, status }) => {
	if (
		new URL(window.location.href).searchParams.get("skeuomorphism") === "true"
	) {
		return <CassetteStatus song={song} status={status} />;
	}

	const [colors, setColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [imageWidth, setImageWidth] = React.useState(400);
	useLayoutEffect(() => {
		if (containerRef.current) {
			setImageWidth(containerRef.current.clientWidth);
		}
	}, [containerRef]);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isTimedExpanded, setIsTimedExpanded] = React.useState(false);
	const lastSongData = React.useRef<{ artist: string; album: string } | null>(
		null
	);

	useEffect(() => {
		if (
			song.artists[0].name !== lastSongData.current?.artist ||
			song.album.name !== lastSongData.current?.album
		) {
			setIsTimedExpanded(true);
			lastSongData.current = {
				artist: song.artists[0].name,
				album: song.album.name,
			};
			const timeout = setTimeout(() => {
				setIsTimedExpanded(false);
			}, 5000);
			return () => clearTimeout(timeout);
		}
	}, [song.id]);

	const isExpanded = isHovered || isTimedExpanded;

	return (
		<motion.div
			key="spotify"
			ref={containerRef}
			initial={{ opacity: 0, x: -25 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -25 }}
			className="relative mt-8 text-white border border-gray-500 border-solid shadow-md rounded-2xl w-96 group"
		>
			<motion.span
				className="absolute px-2 text-sm text-black rounded-md dark:text-white backdrop-blur-sm -top-6"
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1 }}
			>
				I'm currently listening to:
			</motion.span>
			{song.album.id === "5JY7hWEvWCpKVbn7aAy76R" && (
				<div className="absolute right-0 -top-6">
					<Tumbleweed />
				</div>
			)}
			<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
				<div className="absolute top-0 left-0 -translate-y-1/4">
					<SmoothSwapImage
						key={song.album.images[0].url}
						width={imageWidth}
						height={imageWidth}
						alt={song.album.name}
						src={song.album.images[0].url}
						className=""
					/>
				</div>
			</motion.div>
			<motion.div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="flex flex-row items-stretch justify-start gap-2 p-2 transition-colors duration-500 bg-gray-800 bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70"
			>
				<a
					target="_blank"
					href="https://open.spotify.com/"
					className="absolute top-2 right-2"
				>
					<BsSpotify size={24} color={colors.primary} />
				</a>
				<SmoothSwapImage
					alt={song.album.name}
					width={isExpanded ? 96 : 64}
					height={isExpanded ? 96 : 64}
					imageHeight={96}
					imageWidth={96}
					src={song.album.images[0].url}
					className="rounded-lg shadow-md"
					onLoad={async (e) => {
						await new Promise((resolve) => setTimeout(resolve, 250));
						const colors = await extractColors(
							song.album.images[0].url,
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
				<div className="flex flex-col justify-start min-w-0 grow">
					<AnimatePresence mode="wait">
						<motion.a
							key={song.name}
							initial={SongNameAnimationInitial}
							animate={SongNameAnimationAnimate(colors.secondary)}
							exit={SongNameAnimationExit}
							title={song.name}
							className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
							target="_blank"
							href={song.external_urls.spotify}
						>
							{song.name}
						</motion.a>
					</AnimatePresence>
					<ArtistLine isExpanded={isExpanded} colors={colors} song={song} />
					<AlbumLine isExpanded={isExpanded} colors={colors} song={song} />
					<ProgressBar colors={colors} status={status} song={song} />
				</div>
			</motion.div>
		</motion.div>
	);
};

const SmoothSwapImage: React.FC<{
	src: string;
	className: string;
	alt?: string;
	width?: number;
	height?: number;
	imageWidth?: number;
	imageHeight?: number;
	onLoad?: React.ReactEventHandler<HTMLImageElement>;
}> = ({
	src,
	onLoad,
	width,
	height,
	alt,
	className,
	imageWidth,
	imageHeight,
}) => {
	return (
		<div className="relative shrink-0">
			<motion.div
				animate={{
					width: width,
					height: height,
					transition: TRANSITION_CONFIG,
				}}
			>
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
							width={imageWidth ?? width}
							height={imageHeight ?? height}
							src={src}
							className={className}
							onLoad={(e) => {
								onLoad?.(e);
							}}
						/>
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
};

const ArtistLine: React.FC<{
	colors: Colors;
	song: Track;
	isExpanded: boolean;
}> = ({ song, colors, isExpanded }) => {
	return (
		<AnimatePresence>
			<motion.span
				animate={{
					opacity: isExpanded ? 1 : 0,
					height: isExpanded ? "1rem" : 0,
					transition: TRANSITION_CONFIG,
				}}
				className="overflow-visible text-xs font-semibold overflow-x-clip whitespace-nowrap text-ellipsis"
			>
				by{" "}
				<AnimatePresence mode="wait">
					<motion.a
						key={song.artists[0].name}
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
							transition: SWAP_TRANSITION_CONFIG,
						}}
						title={song.artists[0].name}
						target="_blank"
						href={song.artists[0].external_urls.spotify}
					>
						{song.artists[0].name}
					</motion.a>
				</AnimatePresence>
			</motion.span>
		</AnimatePresence>
	);
};

const AlbumLine: React.FC<{
	colors: Colors;
	song: Track;
	isExpanded: boolean;
}> = ({ song, colors, isExpanded }) => {
	return (
		<AnimatePresence>
			<motion.span
				animate={{
					opacity: isExpanded ? 1 : 0,
					height: isExpanded ? "auto" : 0,
					y: isExpanded ? 0 : "1rem",
					transition: TRANSITION_CONFIG,
				}}
				className="overflow-y-visible text-xs font-semibold overflow-x-clip whitespace-nowrap text-ellipsis"
			>
				on{" "}
				<AnimatePresence mode="wait">
					<motion.a
						key={song.album.name}
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
							transition: SWAP_TRANSITION_CONFIG,
						}}
						title={song.album.name}
						target="_blank"
						href={song.album.external_urls.spotify}
					>
						{song.album.name}
					</motion.a>
				</AnimatePresence>
			</motion.span>
		</AnimatePresence>
	);
};

const ProgressBar: React.FC<{
	colors: Colors;
	song: Track;
	status: StatusResponse;
}> = ({ song, status, colors }) => {
	const total = status.timestamps.end - status.timestamps.start;
	const progressBarBgRef = React.useRef<HTMLDivElement>(null);
	const progressBarEndCapRef = React.useRef<HTMLDivElement>(null);

	const elapsed = useMotionValue(0);
	const stringElapsed = useTransform(elapsed, (value) =>
		msToMinutesAndSeconds(value)
	);
	const width = useTransform(elapsed, (elapsed) => {
		const middleLength = progressBarBgRef.current?.clientWidth ?? 1;
		const endCapLenth = progressBarEndCapRef.current?.clientWidth ?? 1;
		const totalLength = middleLength + endCapLenth * 2;
		return (elapsed / total) * totalLength;
	});

	useEffect(() => {
		const current = Math.max(
			Math.min(Date.now() - status.timestamps.start, total),
			0
		);

		elapsed.jump(current);
		const controls = animate(elapsed, total, {
			duration: (total - current) / 1000,
			ease: "linear",
		});

		return () => controls.stop();
	}, [status.timestamps.start, total]);

	const speedUpReels = song.name
		.toLowerCase()
		.includes("in the hall of the mountain king");

	return (
		<div className="flex flex-row grow">
			<div className="relative flex flex-col justify-end">
				<motion.div
					animate={{
						borderColor: colors.secondary,
					}}
					className={clsx("relative z-10 mr-1 rounded-full", styles.reel)}
					style={{
						animationDuration: speedUpReels ? "0.5s" : "2s",
						height: "1.325rem",
						width: "1.325rem",
						borderWidth: "0.4rem",
					}}
				>
					<div className="absolute top-0 w-[2px] h-1 bg-white -translate-x-1/2 left-1/2" />
				</motion.div>
				<div
					ref={progressBarEndCapRef}
					className="absolute bottom-0 right-0 bg-black opacity-50"
					style={{
						width: "calc(50% + 0.125rem)",
						height: "0.325rem",
					}}
				/>
			</div>
			<div className="flex flex-col justify-end w-full gap-0.5">
				<div className="flex flex-row justify-between">
					<motion.span
						animate={{
							color: colors.primary,
							transition: TRANSITION_CONFIG,
						}}
						className="text-xs font-semibold"
					>
						{stringElapsed}
					</motion.span>
					<motion.span
						animate={{
							color: colors.primary,
							transition: TRANSITION_CONFIG,
						}}
						className="text-xs font-semibold"
					>
						{msToMinutesAndSeconds(song.duration_ms)}
					</motion.span>
				</div>
				<div className="relative">
					<div
						key="bg"
						ref={progressBarBgRef}
						className="relative w-full overflow-hidden bg-black opacity-50"
						style={{ height: "0.325rem" }}
					/>
					<motion.div
						style={{ width, height: "0.325rem" }}
						animate={{
							backgroundColor: colors.secondary,
							transition: TRANSITION_CONFIG,
						}}
						className="absolute top-0 z-10 -left-4"
					/>
				</div>
			</div>
			<div className="relative flex flex-col justify-end opacity-50">
				<div
					className={clsx(
						"relative z-10 ml-1 rounded-full border-black",
						styles.reel
					)}
					style={{
						animationDuration: speedUpReels ? "0.5s" : "2s",
						height: "1.325rem",
						width: "1.325rem",
						borderWidth: "0.4rem",
					}}
				>
					<div className="absolute top-0 w-[2px] h-1 bg-white -translate-x-1/2 left-1/2" />
				</div>
				<div
					className="absolute bottom-0 left-0 bg-black"
					style={{
						width: "calc(50% + 0.125rem)",
						height: "0.325rem",
					}}
				/>
			</div>
		</div>
	);
};

function msToMinutesAndSeconds(ms: number) {
	const minutes = Math.floor(ms / 60000);
	const seconds = padLeft(Math.floor((ms % 60000) / 1000).toString(), 2);
	return `${minutes}:${seconds}`;
}

function padLeft(str: string, size: number) {
	let s = str;
	while (s.length < size) s = "0" + s;
	return s;
}

const Tumbleweed: React.FC = () => {
	const { rive, RiveComponent } = useRive({
		src: "/tumbleweed.riv",
		stateMachines: "Main",
		autoplay: true,
	});

	return (
		<div style={{ width: 242, height: 30 }}>
			<RiveComponent />
		</div>
	);
};
