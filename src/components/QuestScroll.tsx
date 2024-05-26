"use client";

import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useAnimate } from "framer-motion";
import { useQuestStore } from "hooks/useQuestStore";
import { Quest } from "quests/QuestStore";
import { useCallback, useEffect, useRef } from "react";

interface QueuedAcceptedAnimation {
	type: "accepted";
	quest: Quest;
}

interface QueuedCompletedAnimation {
	type: "completed";
	quest: Quest;
}

type QueuedAnimation = QueuedAcceptedAnimation | QueuedCompletedAnimation;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const QuestScroll = () => {
	const questStore = useQuestStore();
	const [shadow, animateShadow] = useAnimate();
	const isReady = useRef(false);
	const readyPromise = useRef<() => void>();
	const queuedAnimations = useRef<QueuedAnimation[]>([]);
	const lastAnimationFinishedAt = useRef(0);
	const isQueueProcessing = useRef(false);

	const { rive, RiveComponent } = useRive({
		src: "/quest_scroll.riv",
		stateMachines: "scroll",
		autoplay: true,
		onLoad: () => {
			isReady.current = true;
			readyPromise.current?.();
			console.log("Loaded");
		},
	});

	const open = useStateMachineInput(rive, "scroll", "Open Scroll");
	const close = useStateMachineInput(rive, "scroll", "Close Scroll");

	const processQueue = useCallback(async () => {
		if (queuedAnimations.current.length === 0) {
			return;
		}
		if (isQueueProcessing.current) {
			return;
		}
		isQueueProcessing.current = true;
		if (!isReady.current) {
			await new Promise<void>((resolve) => {
				readyPromise.current = resolve;
			});
		}
		if (Date.now() - lastAnimationFinishedAt.current < 3_000) {
			await pause(Date.now() - lastAnimationFinishedAt.current);
		}
		const next = queuedAnimations.current.shift();
		if (next.type === "accepted") {
			animateShadow(
				"div",
				{ opacity: 1 },
				{
					duration: 0.5,
				}
			);
			rive.setTextRunValue("Title", "Quest Accepted");
			rive.setTextRunValue(
				"Body",
				next.quest.name + "\n" + next.quest.description
			);
			open.fire();
			await pause(8_000);
			close.fire();
			await pause(1_000);
			animateShadow(
				"div",
				{ opacity: 0 },
				{
					duration: 0.5,
				}
			);
		} else if (next.type === "completed") {
			animateShadow(
				"div",
				{
					opacity: 1,
				},
				{
					duration: 0.5,
				}
			);
			rive.setTextRunValue("Title", "Quest Completed");
			rive.setTextRunValue(
				"Body",
				"Rewards\n------------\n" + next.quest.reward
			);
			open.fire();
			await pause(8_000);
			close.fire();
			await pause(1_000);
			animateShadow(
				"div",
				{ opacity: 0 },
				{
					duration: 0.5,
				}
			);
		}
		lastAnimationFinishedAt.current = Date.now();
		isQueueProcessing.current = false;
		processQueue();
	}, [close, open, rive]);

	useEffect(() => {
		const acceptedHandler = async (questAccepted: Quest) => {
			queuedAnimations.current.push({ type: "accepted", quest: questAccepted });
			processQueue();
		};
		const completedHandler = async (questCompleted: Quest) => {
			queuedAnimations.current.push({
				type: "completed",
				quest: questCompleted,
			});
			processQueue();
		};
		questStore.on("questAccepted", acceptedHandler);
		questStore.on("questFinished", completedHandler);
		return () => {
			questStore.off("questAccepted", acceptedHandler);
			questStore.off("questFinished", completedHandler);
		};
	}, [questStore, open, close, rive]);

	return (
		<>
			<div
				className="fixed z-50 -translate-x-1/2 pointer-events-none top-10 left-1/2"
				style={{
					width: 900,
					height: 500,
				}}
				ref={shadow}
			>
				<div
					className="absolute w-full h-full"
					style={{
						background: "radial-gradient(rgba(0,0,0,0.2), transparent 75%)",
						opacity: 0,
					}}
				/>
			</div>
			<div
				className="fixed z-50 -translate-x-1/2 pointer-events-none top-10 left-1/2"
				style={{
					width: 900,
					height: 500,
				}}
			>
				<RiveComponent />
			</div>
		</>
	);
};
