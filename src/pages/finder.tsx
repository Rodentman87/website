import { useAchievementStore } from "hooks/useAchievementStore";
import Head from "next/head";
import React, { MutableRefObject, useLayoutEffect } from "react";

export interface FinderData {
	mainWindowLeft: number;
	mainWindowTop: number;
	chromeHeight: number;
	chromeWidth: number;
	items: Record<string, FinderItemData>;
}

export const FinderItemContext = React.createContext<{
	setItem: (id: string, data: MutableRefObject<HTMLElement>) => void;
	clearItem: (id: string) => void;
}>(null as any);

export function useFinderItem(id: string): MutableRefObject<any> {
	const ref = React.useRef<HTMLElement>();
	const context = React.useContext(FinderItemContext);
	if (context === null) return;
	useLayoutEffect(() => {
		context.setItem(id, ref);
		return () => {
			context.clearItem(id);
		};
	});
	return ref;
}

export interface FinderItemData {
	x: number;
	y: number;
	width: number;
	height: number;
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
	const achievementStore = useAchievementStore();
	const moved = React.useRef(false);
	const itemRefs = React.useRef<Record<string, MutableRefObject<HTMLElement>>>(
		{}
	);

	React.useEffect(() => {
		if (finderData.current) {
			const me = finderData.current.items["me"];
			if (!moved.current && me) {
				moved.current = true;
				const imageX = finderData.current.mainWindowLeft + me.x;
				const imageY =
					finderData.current.mainWindowTop +
					me.y +
					finderData.current.chromeHeight;
				const thisChromeHeight = window.outerHeight - window.innerHeight;
				moveWindowSmooth(
					imageX - (window.innerWidth - me.width) / 2,
					imageY - (window.innerHeight - me.height) / 2 - thisChromeHeight,
					250
				);
			}
		}
		const handleFinderData = (event: StorageEvent) => {
			if (event.key === "finderData") {
				finderData.current = JSON.parse(event.newValue);
				const me = finderData.current.items["me"];
				if (!moved.current && me) {
					moved.current = true;
					const imageX = finderData.current.mainWindowLeft + me.x;
					const imageY =
						finderData.current.mainWindowTop +
						me.y +
						finderData.current.chromeHeight;
					const thisChromeHeight = window.outerHeight - window.innerHeight;
					moveWindowSmooth(
						imageX - (window.innerWidth - me.width) / 2,
						imageY - (window.innerHeight - me.height) / 2 - thisChromeHeight,
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
			if (finderData.current) {
				for (const key in itemRefs.current) {
					const item = finderData.current.items[key];
					const ref = itemRefs.current[key];
					if (!item) {
						ref.current.style.transform = `translate(0px, 0px)`;
						ref.current.style.width = "0px";
						ref.current.style.height = "0px";
						continue;
					}
					const itemX =
						-finderX +
						finderData.current.mainWindowLeft +
						item.x +
						finderData.current.chromeWidth -
						thisChromeWidth;
					const itemY =
						-finderY +
						finderData.current.mainWindowTop +
						item.y +
						finderData.current.chromeHeight -
						thisChromeHeight;
					ref.current.style.transform = `translate(${itemX}px, ${itemY}px)`;
					ref.current.style.width = item.width + "px";
					ref.current.style.height = item.height + "px";
				}
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
			<FinderSync items={itemRefs} id="me">
				{({ ref }) => (
					<img
						src="/maisy-no-glasses.png"
						ref={ref}
						className="fixed top-0 left-0"
						style={{
							width: 0,
							height: 0,
						}}
					/>
				)}
			</FinderSync>
			<FinderSync items={itemRefs} id="achievementButton">
				{({ ref }) => (
					<button
						ref={ref}
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
				)}
			</FinderSync>
		</>
	);
}

const FinderSync: React.FC<{
	items: MutableRefObject<Record<string, MutableRefObject<HTMLElement>>>;
	id: string;
	children: ({ ref }: { ref: MutableRefObject<any> }) => React.ReactElement;
}> = ({ items, id, children }) => {
	const ref = React.useRef<HTMLElement>();
	useLayoutEffect(() => {
		items.current[id] = ref;
		return () => {
			delete items.current[id];
		};
	}, []);

	return children({ ref });
};
