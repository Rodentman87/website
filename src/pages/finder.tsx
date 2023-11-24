import { useAchievementStore } from "hooks/useAchievementStore";
import Head from "next/head";
import React from "react";

export interface FinderData {
	mainWindowLeft: number;
	mainWindowTop: number;
	chromeHeight: number;
	chromeWidth: number;
	meX: number;
	meY: number;
	meWidth: number;
	meHeight: number;
	achievementButtonX: number;
	achievementButtonY: number;
	achievementButtonWidth: number;
	achievementButtonHeight: number;
}

function moveWindowSmooth(x: number, y: number, duration: number) {
	console.log("moving window", x, y);
	const start = performance.now();
	const startX = window.screenLeft;
	const startY = window.screenTop;
	const endX = x;
	const endY = y;
	const distanceX = endX - startX;
	const distanceY = endY - startY;
	const step = (timestamp: number) => {
		const progress = (timestamp - start) / duration;
		if (progress < 1) {
			window.moveTo(
				startX + distanceX * progress,
				startY + distanceY * progress
			);
			window.requestAnimationFrame(step);
		} else {
			window.moveTo(endX, endY);
		}
	};
	window.requestAnimationFrame(step);
}

function resizeWindowSmooth(width: number, height: number, duration: number) {
	const start = performance.now();
	const startWidth = window.outerWidth;
	const startHeight = window.outerHeight;
	const endWidth = width;
	const endHeight = height;
	const distanceWidth = endWidth - startWidth;
	const distanceHeight = endHeight - startHeight;
	const step = (timestamp: number) => {
		const progress = (timestamp - start) / duration;
		if (progress < 1) {
			window.resizeTo(
				startWidth + distanceWidth * progress,
				startHeight + distanceHeight * progress
			);
			window.requestAnimationFrame(step);
		} else {
			window.resizeTo(endWidth, endHeight);
		}
	};
	window.requestAnimationFrame(step);
}

export default function Finder() {
	const finderData = React.useRef<FinderData | null>(
		JSON.parse(
			typeof window !== "undefined"
				? localStorage.getItem("finderData") ?? "null"
				: "null"
		)
	);
	const faceRef = React.useRef<HTMLDivElement | null>(null);
	const buttonRef = React.useRef<HTMLButtonElement | null>(null);
	const achievementStore = useAchievementStore();
	const moved = React.useRef(false);

	React.useEffect(() => {
		if (finderData.current) {
			faceRef.current.style.width = finderData.current.meWidth + "px";
			faceRef.current.style.height = finderData.current.meHeight + "px";
			buttonRef.current.style.width =
				finderData.current.achievementButtonWidth + "px";
			buttonRef.current.style.height =
				finderData.current.achievementButtonHeight + "px";
			if (!moved.current) {
				moved.current = true;
				const imageX =
					finderData.current.mainWindowLeft + finderData.current.meX;
				const imageY =
					finderData.current.mainWindowTop +
					finderData.current.meY +
					finderData.current.chromeHeight;
				const thisChromeHeight = window.outerHeight - window.innerHeight;
				moveWindowSmooth(
					imageX - (window.innerWidth - finderData.current.meWidth) / 2,
					imageY -
						(window.innerHeight - finderData.current.meHeight) / 2 -
						thisChromeHeight,
					250
				);
			}
		}
		const handleFinderData = (event: StorageEvent) => {
			if (event.key === "finderData") {
				if (event.newValue == null) {
					finderData.current = null;
					faceRef.current.style.width = "0px";
					faceRef.current.style.height = "0px";
					buttonRef.current.style.width = "0px";
					buttonRef.current.style.height = "0px";
					return;
				}
				finderData.current = JSON.parse(event.newValue);
				faceRef.current.style.width = finderData.current.meWidth + "px";
				faceRef.current.style.height = finderData.current.meHeight + "px";
				buttonRef.current.style.width =
					finderData.current.achievementButtonWidth + "px";
				buttonRef.current.style.height =
					finderData.current.achievementButtonHeight + "px";
				if (!moved.current) {
					moved.current = true;
					const imageX =
						finderData.current.mainWindowLeft + finderData.current.meX;
					const imageY =
						finderData.current.mainWindowTop +
						finderData.current.meY +
						finderData.current.chromeHeight;
					const thisChromeHeight = window.outerHeight - window.innerHeight;
					moveWindowSmooth(
						imageX - (window.innerWidth - finderData.current.meWidth) / 2,
						imageY -
							(window.innerHeight - finderData.current.meHeight) / 2 -
							thisChromeHeight,
						250
					);
				}
			}
		};

		window.addEventListener("storage", handleFinderData);

		return () => {
			window.removeEventListener("storage", handleFinderData);
		};
	}, []);
	React.useEffect(() => {
		let cancel = false;
		function handler() {
			if (cancel) return;
			const finderX = window.screenLeft;
			const finderY = window.screenTop;
			const thisChromeHeight = window.outerHeight - window.innerHeight;
			const thisChromeWidth = window.outerWidth - window.innerWidth;
			if (finderData.current && faceRef.current) {
				const imageX =
					-finderX +
					finderData.current.mainWindowLeft +
					finderData.current.meX +
					finderData.current.chromeWidth -
					thisChromeWidth;
				const imageY =
					-finderY +
					finderData.current.mainWindowTop +
					finderData.current.meY +
					finderData.current.chromeHeight -
					thisChromeHeight;
				faceRef.current.style.transform = `translate(${imageX}px, ${imageY}px)`;
				const buttonX =
					-finderX +
					finderData.current.mainWindowLeft +
					finderData.current.achievementButtonX +
					finderData.current.chromeWidth -
					thisChromeWidth;
				const buttonY =
					-finderY +
					finderData.current.mainWindowTop +
					finderData.current.achievementButtonY +
					finderData.current.chromeHeight -
					thisChromeHeight;
				buttonRef.current.style.transform = `translate(${buttonX}px, ${buttonY}px)`;
			}

			window.requestAnimationFrame(handler);
		}
		window.requestAnimationFrame(handler);
		return () => {
			cancel = true;
		};
	}, []);

	return (
		<>
			<Head>
				<title>Eye Spy</title>
			</Head>
			<img
				src="/maisy-no-glasses.png"
				ref={faceRef as any}
				className="fixed top-0 left-0"
				style={{
					width: 0,
					height: 0,
				}}
			/>
			<button
				ref={buttonRef}
				onClick={() => {
					achievementStore.markProgress("finder", true);
					const thisChromeHeight = window.outerHeight - window.innerHeight;
					resizeWindowSmooth(600, 100 + thisChromeHeight, 250);
				}}
				className="fixed top-0 left-0 flex flex-row items-center justify-center bg-yellow-300 rounded-full"
				style={{
					width: 0,
					height: 0,
				}}
			>
				<img
					src="/magnifying-glass-tilted-right_1f50e.png"
					alt="Achievements"
					width={36}
					height={36}
				/>
			</button>
		</>
	);
}
