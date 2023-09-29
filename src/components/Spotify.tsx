import { Track } from "@spotify/web-api-ts-sdk";
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
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

export const SpotifyStatus: React.FC = () => {
	const [status, setStatus] = React.useState<StatusResponse | null>(null);
	const [song, setSong] = React.useState<Track | null>(null);
	const songId = useRef<string | null>(null);
	const [colors, setColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});

	const fetchSong = React.useCallback(async () => {
		const status = (await fetch("/api/spotify").then((res) =>
			res.json()
		)) as StatusResponse | null;
		if (status) {
			if (songId.current === null || songId.current !== status.sync_id) {
				const song = (await fetch(`/api/song/${status.sync_id}`).then((res) =>
					res.json()
				)) as Track | null;
				setSong(song);
				songId.current = status.sync_id;
			}
			setStatus(status);
		} else {
			setStatus(null);
			setSong(null);
		}
	}, [song, status]);

	React.useEffect(() => {
		fetchSong();
		const interval = setInterval(fetchSong, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<AnimatePresence>
			{status && (
				<motion.div
					initial={{ opacity: 0, y: 25 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 25 }}
					style={{
						backgroundColor: colors.secondary,
					}}
					className="relative overflow-hidden border border-gray-500 border-solid shadow-md rounded-2xl w-96"
				>
					<motion.div
						key={song.album.images[0].url}
						initial={{ y: 20 }}
						animate={{ y: 0 }}
						transition={{ delay: 0.05, duration: 0.5 }}
						className="absolute top-0 left-0 w-full"
					>
						<img
							alt={song.album.name}
							src={song.album.images[0].url}
							className="absolute top-0 left-0 -translate-y-1/2"
						/>
					</motion.div>
					<div className="flex flex-row items-stretch justify-start gap-2 p-2 bg-white bg-opacity-60 backdrop-blur-xl">
						<a
							target="_blank"
							href="https://open.spotify.com/"
							className="absolute top-2 right-2"
						>
							<BsSpotify size={24} color={colors.primary} />
						</a>
						<Image
							key={song.album.images[0].url}
							quality={100}
							alt={song.album.name}
							width={96}
							height={96}
							src={song.album.images[0].url}
							className="rounded-lg"
							onLoad={async (e) => {
								const colors = await extractColors(
									song.album.images[0].url,
									e.target as HTMLImageElement
								);
								const bestColors = getBestColors(colors, Color("#d1d5db"), 2);
								setColors({
									primary: bestColors.primary.hex(),
									secondary: bestColors.secondary.hex(),
								});
							}}
						/>
						<div className="flex flex-col justify-start min-w-0 grow">
							<a
								title={song.name}
								style={{ color: colors.secondary }}
								className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
								target="_blank"
								href={song.external_urls.spotify}
							>
								{song.name}
							</a>
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

const ArtistLine: React.FC<{ colors: Colors; song: Track }> = ({
	song,
	colors,
}) => {
	return (
		<span className="overflow-hidden text-xs font-semibold whitespace-nowrap text-ellipsis">
			by{" "}
			<a
				title={song.artists[0].name}
				style={{ color: colors.primary }}
				target="_blank"
				href={song.artists[0].external_urls.spotify}
			>
				{song.artists[0].name}
			</a>
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
			<a
				title={song.album.name}
				style={{ color: colors.primary }}
				target="_blank"
				href={song.album.external_urls.spotify}
			>
				{song.album.name}
			</a>
		</span>
	);
};

const ProgressBar: React.FC<{
	colors: Colors;
	song: Track;
	status: StatusResponse;
}> = ({ song, status, colors }) => {
	const total = status.timestamps.end - status.timestamps.start;
	const elapsed = Math.min(Date.now() - status.timestamps.start, total);

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
				<div
					style={{
						backgroundColor: colors.secondary,
						width: `${(elapsed / total) * 100}%`,
					}}
					className="absolute top-0 left-0 h-full rounded-full"
				></div>
			</div>
			<div className="flex flex-row justify-between">
				<span className="text-xs">{msToMinutesAndSeconds(elapsed - 1500)}</span>
				<span className="text-xs">
					{msToMinutesAndSeconds(song.duration_ms)}
				</span>
			</div>
		</div>
	);
};

function msToMinutesAndSeconds(ms: number) {
	const minutes = Math.floor(ms / 60000);
	const seconds = padLeft(((ms % 60000) / 1000).toFixed(0), 2);
	return `${minutes}:${seconds}`;
}

function padLeft(str: string, size: number) {
	let s = str;
	while (s.length < size) s = "0" + s;
	return s;
}
