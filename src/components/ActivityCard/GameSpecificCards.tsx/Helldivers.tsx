import {
	EventType,
	useRive,
	useStateMachineInput,
} from "@rive-app/react-canvas";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
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

export const HelldiversStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const gameId = "553850";
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

	const onShake = useCallback(() => {
		containerRef.current.animate(
			[
				{
					transform: "translateX(0)",
				},
				{
					transform: "translateX(-5px)",
				},
				{
					transform: "translateX(5px)",
				},
				{
					transform: "translateX(0)",
				},
			],
			{
				duration: 250,
				iterations: 3,
			}
		);
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
			<StratagemDisplay onShake={onShake} />
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
					<LiveEventDisplay />
				</div>
			</div>
		</motion.div>
	);
};

const LiveEventDisplay: React.FC = () => {
	const kv = useStatusKV();
	const [_ping, setPing] = React.useState(0);

	const status = useMemo(() => {
		const raw = kv["helldivers"];
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Record<
			string,
			{ state: string; time?: number }
		>;
		console.log(parsed);
		return parsed;
	}, [kv]);

	useEffect(() => {
		const timer = setInterval(() => {
			setPing((ping) => ping + 1);
		}, 500);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex flex-col-reverse justify-start gap-0.25 grow">
			<AnimatePresence mode="popLayout">
				{Object.entries(status).map(([strategem, state], i) => {
					let gemState = state.state;
					if (state.time && state.time < Date.now()) {
						gemState = "IMPACT";
					}
					switch (gemState) {
						case "INBOUND":
							return (
								<motion.div
									key={strategem}
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -8 }}
									className="flex flex-row items-center gap-1 text-xs"
								>
									{strategem} inbound in T-
									{msToMinutesAndSeconds(Math.max(state.time! - Date.now(), 0))}
								</motion.div>
							);
						case "IMPACT":
							return (
								<motion.div
									key={strategem}
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -8 }}
									className="flex flex-row items-center gap-1 text-xs"
								>
									{strategem} landed!
								</motion.div>
							);
						case "ACTIVATING":
							return (
								<motion.div
									key={strategem}
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -8 }}
									className="flex flex-row items-center gap-1 text-xs"
								>
									{strategem} activating!
								</motion.div>
							);
						default:
							return null;
					}
				})}
			</AnimatePresence>
		</div>
	);
};

const StratagemDisplay: React.FC<{ onShake?: () => void }> = ({ onShake }) => {
	const kv = useStatusKV();

	const status = useMemo(() => {
		const raw = kv["helldivers"];
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Record<
			string,
			{ state: string; time?: number }
		>;
		console.log(parsed);
		return parsed;
	}, [kv]);

	return (
		<div className="absolute top-0 right-0">
			<div className="flex flex-row-reverse -translate-y-full">
				<AnimatePresence mode="popLayout">
					{Object.entries(status).map(([strategem, state], i) => {
						let gemState = state.state;
						if (
							gemState === "INBOUND" ||
							gemState === "IMPACT" ||
							gemState === "ACTIVATING"
						) {
							return (
								<motion.div
									className="-mx-11"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									key={strategem}
								>
									<Stratagem
										name={strategem}
										state={gemState}
										impactTime={state.time}
										onShake={onShake}
									/>
								</motion.div>
							);
						}
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};

const Stratagem: React.FC<{
	name: string;
	state: string;
	impactTime?: number;
	onShake?: () => void;
}> = ({ name, state, impactTime, onShake }) => {
	const isReady = useRef(false);
	const readyPromise = useRef<() => void>();
	const { rive, RiveComponent } = useRive({
		src: "/hellpod.riv",
		stateMachines: "Main",
		autoplay: true,
		onLoad: () => {
			isReady.current = true;
			readyPromise.current?.();
			console.log("Loaded");
		},
	});

	useEffect(() => {
		if (rive)
			rive.on(EventType.RiveEvent, (e) => {
				if (
					e.data &&
					typeof e.data === "object" &&
					"name" in e.data &&
					e.data.name === "Shake"
				)
					onShake?.();
			});
	}, [rive]);

	const throwBall = useStateMachineInput(rive, "Main", "throw");
	const hellpod = useStateMachineInput(rive, "Main", "hellpod");
	const fiveHundred = useStateMachineInput(rive, "Main", "500");

	useEffect(() => {
		(async () => {
			if (!isReady.current) {
				// Wait for the rive to be ready
				const promise = new Promise<void>((resolve) => {
					readyPromise.current = resolve;
				});
				await promise;
			}
			if (state === "INBOUND") {
				throwBall.fire();
				setTimeout(() => {
					switch (name) {
						// case "EAGLE 500KG BOMB":
						// 	fiveHundred.fire();
						// 	break;
						default:
							hellpod.fire();
					}
				}, impactTime! - Date.now());
			}
		})();
	}, [throwBall, hellpod, state]);

	return (
		<div style={{ width: 128, height: 512 }}>
			<RiveComponent />
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
});

function msToMinutesAndSeconds(ms: number) {
	const minutes = padLeft(Math.floor((ms % 3600000) / 60000).toString(), 2);
	const seconds = padLeft(Math.floor((ms % 60000) / 1000).toString(), 2);
	return `${minutes}:${seconds}`;
}

function padLeft(str: string, size: number) {
	let s = str;
	while (s.length < size) s = "0" + s;
	return s;
}
