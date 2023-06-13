import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { IoIosLink, IoIosVolumeHigh } from "react-icons/io";

interface SongMetadata {
	title: string;
	artist: string;
	link: string;
}

export const AudioLinkContext = React.createContext<{
	metadata: SongMetadata;
	setMetadata: (metadata: SongMetadata | null) => void;
}>(null);

const AudioLinkDisplay = () => {
	const { metadata } = React.useContext(AudioLinkContext);

	return (
		<div
			style={{
				zIndex: 100000000,
			}}
			className="fixed bottom-2 right-10"
		>
			<AnimatePresence>
				{metadata && (
					<motion.div
						key={metadata.title}
						layoutId={metadata.title}
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
							href={metadata.link}
							target="_blank"
							className="flex flex-row items-center gap-1 px-2 py-1 text-xs text-black"
						>
							<IoIosVolumeHigh size={24} className="inline-block" />
							<span className="align-middle">
								{metadata.title} - {metadata.artist}
							</span>
							<IoIosLink size={16} className="inline-block" />
						</a>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export const AudioLink: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [metadata, setMetadata] = React.useState<SongMetadata | null>(null);

	return (
		<AudioLinkContext.Provider value={{ metadata, setMetadata }}>
			<AudioLinkDisplay />
			{children}
		</AudioLinkContext.Provider>
	);
};
