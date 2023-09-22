import { Track } from "@spotify/web-api-ts-sdk";
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useEffect } from "react";
import { BsSpotify } from "react-icons/bs";

interface StatusResponse {
	start: number;
	end: number;
	song: Track;
}

interface Colors {
	primary: string;
	secondary: string;
}

export const SpotifyStatus: React.FC = () => {
	const [status, setStatus] = React.useState<StatusResponse | null>(null);
	const [colors, setColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});

	const fetchSong = React.useCallback(() => {
		fetch("/api/spotify")
			.then((res) => res.json())
			.then((data) => setStatus(data));
	}, []);

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
					<img
						alt={status.song.album.name}
						src={status.song.album.images[0].url}
						className="absolute top-0 left-0 w-full -translate-y-1/2"
					/>
					<div className="flex flex-row items-stretch justify-start gap-2 p-2 bg-white bg-opacity-50 backdrop-blur-2xl">
						<a
							target="_blank"
							href="https://open.spotify.com/"
							className="absolute top-2 right-2"
						>
							<BsSpotify size={24} color={colors.primary} />
						</a>
						<Image
							key={status.song.album.images[0].url}
							quality={100}
							alt={status.song.album.name}
							width={96}
							height={96}
							src={status.song.album.images[0].url}
							className="rounded-lg"
							onLoad={async (e) => {
								const colors = await extractColors(
									status.song.album.images[0].url,
									e.target as HTMLImageElement
								);
								const bestColors = getBestColors(colors, Color("#FFFFFF"));
								setColors({
									primary: bestColors.primary.hex(),
									secondary: bestColors.secondary.hex(),
								});
							}}
						/>
						<div className="flex flex-col justify-start min-w-0 grow">
							<a
								title={status.song.name}
								style={{ color: colors.primary }}
								className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
								target="_blank"
								href={status.song.external_urls.spotify}
							>
								{status.song.name}
							</a>
							<ArtistLine colors={colors} data={status} />
							<AlbumLine colors={colors} data={status} />
							<ProgressBar colors={colors} data={status} />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const ArtistLine: React.FC<{ colors: Colors; data: StatusResponse }> = ({
	data,
	colors,
}) => {
	return (
		<span className="overflow-hidden text-xs font-semibold whitespace-nowrap text-ellipsis">
			by{" "}
			<a
				title={data.song.artists[0].name}
				style={{ color: colors.primary }}
				target="_blank"
				href={data.song.artists[0].external_urls.spotify}
			>
				{data.song.artists[0].name}
			</a>
		</span>
	);
};

const AlbumLine: React.FC<{ colors: Colors; data: StatusResponse }> = ({
	data,
	colors,
}) => {
	return (
		<span className="overflow-hidden text-xs font-semibold whitespace-nowrap text-ellipsis">
			on{" "}
			<a
				title={data.song.album.name}
				style={{ color: colors.primary }}
				target="_blank"
				href={data.song.album.external_urls.spotify}
			>
				{data.song.album.name}
			</a>
		</span>
	);
};

const ProgressBar: React.FC<{ colors: Colors; data: StatusResponse }> = ({
	data,
	colors,
}) => {
	const total = data.end - data.start;
	const elapsed = Math.min(Date.now() - data.start, total);

	const [_, setRerender] = React.useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setRerender((old) => old + 1);
		}, 20);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col justify-end w-full grow">
			<div className="relative w-full h-2 overflow-hidden bg-gray-500 rounded-full">
				<div
					style={{
						backgroundColor: colors.primary,
						width: `${(elapsed / total) * 100}%`,
					}}
					className="absolute top-0 left-0 h-full rounded-full"
				></div>
			</div>
			<div className="flex flex-row justify-between">
				<span className="text-xs">{msToMinutesAndSeconds(elapsed)}</span>
				<span className="text-xs">
					{msToMinutesAndSeconds(data.song.duration_ms)}
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
