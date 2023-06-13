import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";

export const AudioAutoplayPrompt = () => {
	const [shouldShow, setShouldShow] = React.useState(false);
	const audioRef = React.useRef<HTMLAudioElement>(null);
	const checkerTimer = React.useRef<ReturnType<typeof setInterval> | null>(
		null
	);

	useEffect(() => {
		const val = localStorage.getItem("audio-autoplay-prompt-skip");
		if (val === "true") return;
		if (!audioRef.current) return;
		audioRef.current.volume = 0;
		(async () => {
			try {
				await audioRef.current.play();
			} catch (e) {
				// Can't autoplay audio
				setShouldShow(true);
				checkerTimer.current = setInterval(async () => {
					try {
						await audioRef.current.play();
						setShouldShow(false);
						clearInterval(checkerTimer.current!);
						checkerTimer.current = null;
					} catch (e) {
						// Can't autoplay audio still
					}
				}, 250);
			}
		})();
	}, []);

	return (
		<div className="fixed top-0 left-12">
			<audio
				ref={audioRef}
				src="/500-milliseconds-of-silence.mp3"
				autoPlay={false}
			/>
			<AnimatePresence>
				{shouldShow && (
					<motion.div
						className="relative max-w-xs p-2 text-sm bg-white border-2 rounded-md shadow-lg text-slate-600 border-slate-600"
						initial={{
							y: -50,
						}}
						animate={{
							y: 10,
						}}
						exit={{
							y: -80,
						}}
					>
						This site has some audio effects. Please allow audio autoplay to
						hear them. I promise I won't abuse it.
						<button
							onClick={() => {
								localStorage.setItem("audio-autoplay-prompt-skip", "true");
								setShouldShow(false);
							}}
							className="absolute text-red-500 bottom-2 right-2"
						>
							dismiss
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
