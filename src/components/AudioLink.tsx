import { AnimatePresence, motion } from "framer-motion";
import React, { useDebugValue, useSyncExternalStore } from "react";
import { IoIosLink, IoIosVolumeHigh } from "react-icons/io";

class AudioHandler {
	songs: Song[] = [];
	songListSubscribers = new Set<React.Dispatch<React.SetStateAction<Song[]>>>();

	private nextId = 0;

	constructor() {
		this.subscribeSongList = this.subscribeSongList.bind(this);
	}

	subscribeSongList(subscriber: React.Dispatch<React.SetStateAction<Song[]>>) {
		this.songListSubscribers.add(subscriber);
		return () => {
			this.songListSubscribers.delete(subscriber);
		};
	}

	private updateSongList(newSongList: Song[]) {
		this.songs = newSongList;
		this.songListSubscribers.forEach((subscriber) => {
			subscriber(this.songs);
		});
	}

	playSong(metadata: Omit<SongMetadata, "id">, initialVolume: number = 100) {
		const song = new Song(
			{
				...metadata,
				id: this.nextId++,
			},
			initialVolume,
			this
		);
		this.updateSongList([...this.songs, song]);
		return song;
	}

	endSong(id: number) {
		const song = this.songs.find((song) => song.metadata.id === id);
		if (song) {
			song.cleanup();
			this.updateSongList(this.songs.filter((song) => song.metadata.id !== id));
		}
	}
}

export class Song {
	element: HTMLAudioElement | null = null;
	timer: ReturnType<typeof setInterval> | null = null;
	timerReject: (() => void) | null = null;
	ended = false;
	playing = false;

	constructor(
		public readonly metadata: SongMetadata,
		public volume: number,
		public readonly handler: AudioHandler
	) {}

	async setSongElement(element: HTMLAudioElement) {
		this.element = element;
		if (element) {
			element.volume = this.volume / 100;
			if (this.playing)
				element.play().catch((err) => {
					// User disabled autoplay
					this.end();
				});
			else element.pause();
		}
	}

	async play() {
		this.playing = true;
		if (this.element) {
			this.element.play().catch((err) => {
				// User disabled autoplay
				this.end();
			});
		}
	}

	pause() {
		this.playing = false;
		if (this.element) {
			this.element.pause();
		}
	}

	end() {
		this.handler.endSong(this.metadata.id);
	}

	cancelTimer() {
		if (this.timer) {
			if (this.timerReject) this.timerReject();
			clearInterval(this.timer);
		}
		this.timer = null;
		this.timerReject = null;
	}

	async fade(speed: number = 1, targetVolume: number = 100) {
		if (speed === 0) throw new Error("Speed cannot be 0");
		this.cancelTimer();
		return new Promise<void>((resolve, reject) => {
			this.timerReject = reject;
			this.timer = setInterval(() => {
				const newVolume = this.adjustVolume(speed);
				if (
					(speed < 1 && newVolume <= targetVolume) ||
					(speed > 1 && newVolume >= targetVolume)
				) {
					this.setVolume(targetVolume);
					if (this.timer) clearInterval(this.timer!);
					this.timer = null;
					this.timerReject = null;
					resolve();
				}
			}, 100);
		});
	}

	adjustVolume(amount: number) {
		const newVolume = Math.max(Math.min(100, this.volume + amount), 0);
		if (this.element) {
			this.element.volume = newVolume / 100;
		}
		this.volume = newVolume;
		return newVolume;
	}

	setVolume(volume: number) {
		if (this.element) {
			this.element.volume = volume / 100;
		}
		this.volume = volume;
	}

	cleanup() {
		this.cancelTimer();
		if (this.element) {
			this.element.pause();
		}
		this.ended = true;
	}
}

interface SongMetadata {
	id: number;
	title: string;
	artist: string;
	location: string;
	loop: boolean;
	link: string;
}

function useSonglist() {
	const audioHandler = React.useContext(AudioLinkContext);

	const songlist = useSyncExternalStore<Song[]>(
		audioHandler.subscribeSongList,
		() => audioHandler.songs,
		() => audioHandler.songs
	);

	useDebugValue(songlist);

	return songlist;
}

export const AudioLinkContext = React.createContext<AudioHandler>(
	new AudioHandler()
);

const AudioLinkDisplay = () => {
	const songlist = useSonglist();

	return (
		<div
			style={{
				zIndex: 100000000,
			}}
			className="fixed flex flex-col gap-2 bottom-2 right-10"
		>
			<AnimatePresence>
				{songlist.map((song) => (
					<motion.div
						key={song.metadata.id}
						layoutId={song.metadata.title}
						initial={{
							y: 100,
						}}
						animate={{
							y: 0,
						}}
						exit={{
							y: 100,
						}}
						className="transition-all bg-white border-2 rounded-full shadow-md hover:shadow-xl bg-opacity-40 backdrop-blur-lg border-slate-600"
					>
						<a
							href={song.metadata.link}
							target="_blank"
							className="flex flex-row items-center gap-1 px-2 py-1 text-xs text-black"
						>
							<IoIosVolumeHigh size={24} className="inline-block" />
							<span className="align-middle">
								{song.metadata.title} - {song.metadata.artist}
							</span>
							<IoIosLink size={16} className="inline-block" />
						</a>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

const SongPlayer: React.FC = () => {
	const songlist = useSonglist();

	return (
		<>
			{songlist.map((song) => (
				<audio
					ref={(element) => {
						song.setSongElement(element!);
					}}
					key={song.metadata.id}
					src={song.metadata.location}
					loop={song.metadata.loop}
				/>
			))}
		</>
	);
};

export const AudioSystem: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<AudioLinkContext.Provider value={new AudioHandler()}>
			<AudioLinkDisplay />
			<SongPlayer />
			{children}
		</AudioLinkContext.Provider>
	);
};
