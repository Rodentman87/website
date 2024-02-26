import { Track } from "@spotify/web-api-ts-sdk";
import { AnimatePresence } from "framer-motion";
import { useAchievementStore } from "hooks/useAchievementStore";
import React from "react";
import { GameStatus } from "./Game";
import { SpotifyStatus } from "./Spotify";

const ME = "152566937442975744";
const ENDPOINT = "wss://api.lanyard.rest/socket";

export interface StatusResponse {
	id: string;
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

export const ActivityCard: React.FC = () => {
	const [status, setStatus] = React.useState<StatusResponse | null>(null);
	const [spotifyStatus, setSpotifyStatus] =
		React.useState<StatusResponse | null>(null);
	const [song, setSong] = React.useState<Track | null>(null);
	const songId = React.useRef<string | null>(null);

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
			setSpotifyStatus(newStatus);
		},
		[]
	);

	React.useEffect(() => {
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
						// Get status with spotify status first
						const spotifyStatus = d.activities.find(
							(activity: any) => activity.type === 2
						);
						if (spotifyStatus) {
							setStatusAndFetchSong(spotifyStatus);
						} else {
							setSpotifyStatus(null);
						}
						const gameStatus = d.activities.find(
							(activity: any) => activity.type === 0
						);
						if (gameStatus) {
							// If no spotify status, get the first status
							setStatus(gameStatus);
						} else {
							setStatus(null);
						}
					}
					break;
			}
		});

		return () => ws.close();
	}, []);

	return (
		<AnimatePresence>
			{status && <GameStatus key={status.id} status={status} />}
			{spotifyStatus && (
				<SpotifyStatus
					key={spotifyStatus.id}
					song={song}
					status={spotifyStatus}
				/>
			)}
		</AnimatePresence>
	);
};
