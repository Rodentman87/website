import { AnimatePresence, motion } from "framer-motion";
import { useQuestStore } from "hooks/useQuestStore";
import {
	ActualQuest,
	QuestBooleanRequirement,
	QuestBooleanRequirementProgress,
	QuestNumberRequirement,
	QuestNumberRequirementProgress,
	QuestRequirement,
	QuestRequirementProgress,
} from "quests/QuestStore";
import { useSyncExternalStore } from "react";

const containerVariants = {
	hidden: {
		opacity: 0,
		x: 15,
		transition: {
			duration: 0.2,
			delay: 0.5,
		},
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.2,
		},
	},
};

export const QuestRequirementsDisplay = () => {
	const questStore = useQuestStore();
	const activeQuest = useSyncExternalStore<ActualQuest | null>(
		(onChange) => {
			const handler = () => {
				onChange();
			};
			questStore.on("changeActiveQuest", handler);
			return () => {
				questStore.off("changeActiveQuest", handler);
			};
		},
		() => questStore.activeQuest,
		() => null
	);

	return (
		<div className="fixed top-0 right-0 flex flex-col gap-2 p-4">
			<button
				className="w-64 bg-red-300 rounded-md"
				onClick={() => questStore.reset()}
			>
				Reset quests
			</button>
			<AnimatePresence>
				{activeQuest && (
					<motion.div
						key={activeQuest.id}
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="flex flex-col w-64"
					>
						<span className="self-end">{activeQuest.name}</span>
						<hr className="my-0" />
						<ul className="p-0">
							{activeQuest.requirements.map((req) => {
								return (
									<li key={req.id} className="list-none">
										<ProgressDisplay
											key={req.id}
											quest={activeQuest}
											req={req}
										/>
									</li>
								);
							})}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const ProgressDisplay: React.FC<{
	quest: ActualQuest;
	req: QuestRequirement;
}> = ({ req, quest }) => {
	const questStore = useQuestStore();
	const progress = useSyncExternalStore(
		(onChange) => {
			const handler = () => {
				onChange();
			};
			questStore.on("changeActiveQuest", handler);
			questStore.on("questProgressUpdated", handler);
			questStore.on("questFinished", handler);
			return () => {
				questStore.off("changeActiveQuest", handler);
				questStore.off("questProgressUpdated", handler);
				questStore.off("questFinished", handler);
			};
		},
		() =>
			questStore
				.getQuestProgress(quest.id)
				.requirementProgress.find(
					(r) => r.id === req.id
				) as QuestRequirementProgress,
		() => null
	);

	switch (req.type) {
		case "number":
			return (
				<NumberProgressDisplay
					quest={quest}
					progress={progress as QuestNumberRequirementProgress}
					req={req}
				/>
			);
		case "boolean":
			return (
				<BooleanProgressDisplay
					quest={quest}
					progress={progress as QuestBooleanRequirementProgress}
					req={req}
				/>
			);
	}
};

const BooleanProgressDisplay: React.FC<{
	quest: ActualQuest;
	progress: QuestBooleanRequirementProgress;
	req: QuestBooleanRequirement;
}> = ({ progress, req, quest }) => {
	const questStore = useQuestStore();
	const isComplete = progress.value;

	return (
		<label>
			<input
				type="checkbox"
				checked={progress.value}
				className="mr-2"
				onClick={() => {
					questStore.markProgress(quest.id, req.id as any, !progress.value);
				}}
			/>
			<span className="relative">
				{req.label}
				<motion.div
					layout
					className="h-[2px] bg-black absolute left-0 top-1/2"
					style={{
						width: isComplete ? "100%" : "0%",
					}}
				/>
			</span>
		</label>
	);
};

const NumberProgressDisplay: React.FC<{
	quest: ActualQuest;
	progress: QuestNumberRequirementProgress;
	req: QuestNumberRequirement;
}> = ({ progress, req, quest }) => {
	const questStore = useQuestStore();
	const isComplete = progress.value >= req.number;

	return (
		<>
			<span className="relative">
				{req.label}: {progress.value} / {req.number}
				<motion.div
					layout
					className="h-[2px] bg-black absolute left-0 top-1/2"
					style={{
						width: isComplete ? "100%" : "0%",
					}}
				/>
			</span>
			<div className="relative w-full h-2 overflow-hidden bg-black rounded-full">
				<motion.div
					animate={{
						width: `${(progress.value / req.number) * 100}%`,
						opacity: 1,
					}}
					className="absolute top-0 left-0 h-full bg-green-400 rounded-full"
				></motion.div>
			</div>
			<div className="flex flex-row justify-between">
				<button
					onClick={() => {
						questStore.markProgress(quest.id, req.id as any, -1);
					}}
				>
					-
				</button>
				<button
					onClick={() => {
						questStore.markProgress(quest.id, req.id as any, 1);
					}}
				>
					+
				</button>
			</div>
		</>
	);
};
