import { Track } from "@spotify/web-api-ts-sdk";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { StatusResponse } from "../ActivityCard";
import { Cassette } from "./Cassette";

export const CassetteStatus: React.FC<{
	song: Track;
	status: StatusResponse;
}> = ({ song, status }) => {
	const [isHovered, setIsHovered] = React.useState(false);
	const [justChanged, setJustChanged] = React.useState(false);
	const lastSyncId = React.useRef<string | null>(null);

	useEffect(() => {
		if (status.sync_id !== lastSyncId.current) {
			setJustChanged(true);
			setTimeout(() => setJustChanged(false), 4000);
			lastSyncId.current = status.sync_id;
		}
	}, [status.sync_id]);

	const scaleUp = isHovered || justChanged;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				drag
				dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				initial={{ x: -400, scale: 0.75 }}
				animate={{
					x: 0,
					scale: scaleUp ? 0.75 : 0.5,
					transformOrigin: "bottom left",
					transition: {
						delay: justChanged ? 0.5 : 0,
						ease: "easeInOut",
						duration: justChanged ? 0.75 : 0.3,
					},
				}}
				exit={{ x: -400, scale: 0.75 }}
				key={song.id}
			>
				<Cassette
					title={song.name}
					songLink={song.external_urls.spotify}
					artist={song.artists[0].name}
					artistLink={song.artists[0].external_urls.spotify}
					album={song.album.name}
					albumLink={song.album.external_urls.spotify}
					cover={song.album.images[0].url}
					duration={song.duration_ms / 1000}
					endsAt={status.timestamps?.end}
				/>
			</motion.div>
		</AnimatePresence>
	);
};
