import { Track } from "@spotify/web-api-ts-sdk";
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import { useAchievementStore } from "hooks/useAchievementStore";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { BsSpotify } from "react-icons/bs";

interface StatusResponse {
	type: number;
	name: string;
	url?: string;
	created_at: number;
	timestamps?: {
		start: number;
		end?: number;
	};
	application_id?: string;
	details?: string;
	state?: string;
	emoji?: {
		name?: string;
		id?: string;
		animated?: boolean;
	};
	party?: {
		id?: string;
		size?: [number, number];
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	sync_id?: string;
}

interface Colors {
	primary: string;
	secondary: string;
}

const ME = "152566937442975744";
const ENDPOINT = "wss://api.lanyard.rest/socket";

export const SpotifyStatus: React.FC = () => {
	const [socket, setSocket] = React.useState<WebSocket | null>(null);
	const [status, setStatus] = React.useState<StatusResponse | null>(null);
	const [song, setSong] = React.useState<Track | null>(null);
	const songId = useRef<string | null>(null);
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

	const achievementStore = useAchievementStore();

	const setStatusAndFetchSong = React.useCallback(
		async (newStatus: StatusResponse) => {
			if (newStatus) {
				if (songId.current === null || songId.current !== newStatus.sync_id) {
					const song = (await fetch(`/api/song/${newStatus.sync_id}`).then(
						(res) => res.json()
					)) as Track | null;
					if (
						song.artists.some(
							(artist) => artist.id === "1HOeqtP7tHkKNJNLzQ2tnr"
						)
					) {
						achievementStore.markProgress("ee", true);
					}
					setSong(song);
					songId.current = newStatus.sync_id;
				}
			}
			setStatus(newStatus);
		},
		[]
	);

	useEffect(() => {
		const ws = new WebSocket(ENDPOINT);

		ws.addEventListener("open", () => {});

		ws.addEventListener("message", ({ data }) => {
			const { op, t, d } = JSON.parse(data);

			switch (op) {
				case 1:
					// Hello
					const { heartbeat_interval } = d;
					ws.send(
						JSON.stringify({
							op: 2,
							d: {
								subscribe_to_id: ME,
							},
						})
					);

					setInterval(() => {
						ws.send(
							JSON.stringify({
								op: 3,
							})
						);
					}, heartbeat_interval);
					break;
				case 0:
					// Event
					if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
						setStatusAndFetchSong(
							d.activities.find((activity: any) => activity.type === 2)
						);
					}
					break;
			}
		});

		ws.addEventListener("close", () => {
			setSocket(null);
		});

		setSocket(ws);
		return () => ws.close();
	}, []);

	return (
		<AnimatePresence>
			{status && (
				<motion.div
					ref={containerRef}
					initial={{ opacity: 0, y: 25 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 25 }}
					className="relative border border-gray-500 border-solid shadow-md rounded-2xl w-96 group"
				>
					<motion.span
						className="absolute text-sm -top-6 left-2"
						initial={{ y: 15, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 1 }}
					>
						I'm currently listening to:
					</motion.span>
					<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
						<div className="absolute top-0 left-0 -translate-y-1/4">
							<SmoothSwapImage
								key={imageWidth}
								width={imageWidth}
								height={imageWidth}
								alt={song.album.name}
								src={song.album.images[0].url}
								className=""
							/>
						</div>
					</motion.div>
					<div className="flex flex-row items-stretch justify-start gap-2 p-2 transition-colors duration-500 bg-white bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70">
						<a
							target="_blank"
							href="https://open.spotify.com/"
							className="absolute top-2 right-2"
						>
							<BsSpotify size={24} color={colors.primary} />
						</a>
						<SmoothSwapImage
							alt={song.album.name}
							width={96}
							height={96}
							src={song.album.images[0].url}
							className="rounded-lg shadow-md"
							onLoad={async (e) => {
								await new Promise((resolve) => setTimeout(resolve, 250));
								const colors = await extractColors(
									song.album.images[0].url,
									e.target as HTMLImageElement
								);
								const bestColors = getBestColors(colors, Color("#d1d5db"), 2);
								console.log("Best colors:", bestColors);
								setColors({
									primary: bestColors.primary.hex(),
									secondary: bestColors.secondary.hex(),
								});
							}}
						/>
						<div className="flex flex-col justify-start min-w-0 grow">
							<AnimatePresence mode="popLayout">
								<motion.a
									key={song.name}
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
									title={song.name}
									className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
									target="_blank"
									href={song.external_urls.spotify}
								>
									{song.name}
								</motion.a>
							</AnimatePresence>
							<ArtistLine colors={colors} song={song} />
							<AlbumLine colors={colors} song={song} />
							<ProgressBar colors={colors} status={status} song={song} />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const SmoothSwapImage: React.FC<{
	src: string;
	className: string;
	alt?: string;
	width?: number;
	height?: number;
	onLoad?: React.ReactEventHandler<HTMLImageElement>;
}> = ({ src, onLoad, width, height, alt, className }) => {
	const [oldSrc, setOldSrc] = React.useState(src);
	const [showOldImage, setShowOldImage] = React.useState(true);

	return (
		<div className="relative shrink-0">
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
};

const ArtistLine: React.FC<{ colors: Colors; song: Track }> = ({
	song,
	colors,
}) => {
	return (
		<span className="overflow-hidden text-xs font-semibold whitespace-nowrap text-ellipsis">
			by{" "}
			<AnimatePresence mode="popLayout">
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
					}}
					title={song.artists[0].name}
					target="_blank"
					href={song.artists[0].external_urls.spotify}
				>
					{song.artists[0].name}
				</motion.a>
			</AnimatePresence>
		</span>
	);
};

const AlbumLine: React.FC<{ colors: Colors; song: Track }> = ({
	song,
	colors,
}) => {
	return (
		<span className="overflow-hidden text-xs font-semibold whitespace-nowrap text-ellipsis">
			on{" "}
			<AnimatePresence mode="popLayout">
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
					}}
					title={song.album.name}
					target="_blank"
					href={song.album.external_urls.spotify}
				>
					{song.album.name}
				</motion.a>
			</AnimatePresence>
		</span>
	);
};

const ProgressBar: React.FC<{
	colors: Colors;
	song: Track;
	status: StatusResponse;
}> = ({ song, status, colors }) => {
	const total = status.timestamps.end - status.timestamps.start;
	const elapsed = Math.max(
		Math.min(Date.now() - status.timestamps.start, total),
		0
	); // Clamp to 0 and total

	const [_, setRerender] = React.useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setRerender((old) => old + 1);
		}, 20);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col justify-end w-full grow">
			<div className="relative overflow-hidden rounded-full">
				<div className="relative w-full h-2 overflow-hidden bg-white rounded-full opacity-40"></div>
				<AnimatePresence>
					<motion.div
						key={song.id}
						initial={{
							opacity: 1,
						}}
						animate={{
							width: `${(elapsed / total) * 100}%`,
							backgroundColor: colors.secondary,
							opacity: 1,
						}}
						exit={{
							opacity: 0,
							transition: {
								duration: 1.5,
							},
						}}
						className="absolute top-0 left-0 h-full rounded-full"
					></motion.div>
				</AnimatePresence>
			</div>
			<div className="flex flex-row justify-between">
				<span className="text-xs">{msToMinutesAndSeconds(elapsed)}</span>
				<span className="text-xs">
					{msToMinutesAndSeconds(song.duration_ms)}
				</span>
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
