import { ThemeContext } from "@components/ThemeToggle";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import {
	IoMdArrowRoundBack,
	IoMdArrowRoundForward,
	IoMdPause,
	IoMdPlay,
} from "react-icons/io";
import { useShikiHighlighter } from "../ShikiProvider";

export interface ScriptLine {
	indicateLine: number;
	indicateRange?: [number, number];
	backgroundColor?: string;
	variables?: Record<string, any>;
	consoleLine?: string;
	replacePointer?: string;
}

interface ScriptedCodeProps {
	code: string;
	language: string;
	script: ScriptLine[];
	id: string;
}

export const ScriptedCode: React.FC<ScriptedCodeProps> = ({
	code,
	language,
	script,
	id,
}) => {
	const highlighter = useShikiHighlighter();

	const playTick = useRef(null);
	const [isPlaying, setIsPlaying] = React.useState(false);

	useEffect(() => {
		if (!isPlaying && playTick.current) {
			clearInterval(playTick.current);
		}
		if (isPlaying) {
			if (playTick.current) clearInterval(playTick.current);
			playTick.current = setInterval(() => {
				setCurrentScriptLinenumber((current) => {
					if (current === script.length - 1) {
						setIsPlaying(false);
						return current;
					}
					return current + 1;
				});
			}, 1000);
		}
		return () => {
			if (playTick.current) clearInterval(playTick.current);
		};
	}, [isPlaying]);

	const [currentScriptLineNumber, setCurrentScriptLinenumber] =
		React.useState(0);

	const currentScriptLine = script[currentScriptLineNumber];

	const theme = useContext(ThemeContext);

	const renderedCode = useMemo(() => {
		if (!highlighter) return;
		return highlighter.codeToHtml(code, {
			lang: language,
			theme: theme.dark ? "solarized-dark" : "solarized-light",
		});
	}, [highlighter, code, language]);

	const numberOfLines = useMemo(() => {
		return code.split("\n").length;
	}, [code]);

	return (
		<div className="relative flex flex-col mb-10 text-black dark:text-white">
			<LayoutGroup id={id}>
				<div
					className="z-10 flex flex-row"
					style={{
						backgroundColor: theme.dark ? "#073642" : "#fdf6e3",
					}}
				>
					<div className="flex flex-col">
						{Array.from(Array(numberOfLines).keys()).map((lineNumber) => (
							<span className="relative px-1 font-mono" key={lineNumber}>
								{currentScriptLine.indicateLine === lineNumber + 1 && (
									<>
										<motion.span
											layoutId="line-indicator"
											className="absolute z-10 px-1 -left-6"
										>
											{currentScriptLine.replacePointer ?? "👉"}
										</motion.span>
										<motion.span
											layoutId="line-indicator-bg"
											className={clsx(
												"absolute h-full font-mono from-blue-100 dark:from-blue-800 bg-gradient-to-r",
												{
													"to-blue-100 dark:to-blue-800":
														currentScriptLine.indicateRange,
												}
											)}
											style={{
												left:
													"calc(100% + " +
													(currentScriptLine.indicateRange?.[0] ?? 0) +
													"ch)",
												width: currentScriptLine.indicateRange
													? currentScriptLine.indicateRange[1] -
													  currentScriptLine.indicateRange[0] +
													  "ch"
													: "24rem",
												background: colorNameToColor(
													currentScriptLine.backgroundColor,
													theme.dark
												),
											}}
										/>
									</>
								)}
								<span className="relative z-10 pr-1">{lineNumber + 1}</span>
							</span>
						))}
					</div>
					<div
						className="z-10"
						dangerouslySetInnerHTML={{ __html: renderedCode }}
					></div>
				</div>
				<Controls
					isPlaying={isPlaying}
					setIsPlaying={setIsPlaying}
					currentScriptLineNumber={currentScriptLineNumber}
					scriptLength={script.length}
					setCurrentScriptLinenumber={setCurrentScriptLinenumber}
				/>
				<VariablesPanel variables={currentScriptLine.variables ?? {}} />
				<ConsoleLinesPanel
					consoleLine={currentScriptLine.consoleLine}
					index={currentScriptLineNumber}
				/>
			</LayoutGroup>
		</div>
	);
};

function colorNameToColor(color: string, dark: boolean) {
	switch (color) {
		case "green":
			return dark ? "rgb(34, 106, 60)" : "rgb(187 247 208)";
		case "red":
			return dark ? "rgb(145, 68, 68)" : "rgb(254 202 202)";
		default:
			return undefined;
	}
}

interface ControlsProps {
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	currentScriptLineNumber: number;
	setCurrentScriptLinenumber: React.Dispatch<React.SetStateAction<number>>;
	scriptLength: number;
}

const Controls: React.FC<ControlsProps> = ({
	currentScriptLineNumber,
	setCurrentScriptLinenumber,
	scriptLength,
	isPlaying,
	setIsPlaying,
}) => {
	const theme = useContext(ThemeContext);

	return (
		<div
			className="z-10 flex flex-row justify-between px-2"
			style={{ backgroundColor: theme.dark ? "#002b36" : "#eee8d5" }}
		>
			<div className="flex flex-row justify-center gap-1 px-2 grow">
				<button
					aria-label="Previous step"
					disabled={currentScriptLineNumber === 0}
					className="disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400"
					onClick={() =>
						setCurrentScriptLinenumber(currentScriptLineNumber - 1)
					}
				>
					<IoMdArrowRoundBack />
				</button>
				{Array.from(Array(scriptLength).keys()).map((stepNumber) => (
					<button
						className="relative px-1 font-mono"
						key={stepNumber}
						onClick={() => setCurrentScriptLinenumber(stepNumber)}
					>
						{currentScriptLineNumber === stepNumber && (
							<motion.span
								layoutId="step-indicator"
								className="absolute left-0 w-full h-full border-b-2 border-blue-300"
							/>
						)}
						{stepNumber + 1}
					</button>
				))}
				<button
					aria-label="Next step"
					disabled={currentScriptLineNumber === scriptLength - 1}
					className="disabled:cursor-not-allowed disabled:text-gray-500"
					onClick={() =>
						setCurrentScriptLinenumber(currentScriptLineNumber + 1)
					}
				>
					<IoMdArrowRoundForward />
				</button>
			</div>

			<button
				aria-label={isPlaying ? "Pause" : "Play"}
				onClick={() => {
					if (currentScriptLineNumber === scriptLength - 1)
						setCurrentScriptLinenumber(0);
					setIsPlaying((current) => !current);
				}}
			>
				{isPlaying ? <IoMdPause /> : <IoMdPlay />}
			</button>
		</div>
	);
};

interface VariablesPanelProps {
	variables: Record<string, any>;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ variables }) => {
	const theme = useContext(ThemeContext);

	return (
		<div className="absolute flex flex-col items-start gap-2 pl-2 left-full">
			<AnimatePresence>
				{Object.keys(variables).length > 0 && (
					<motion.div
						className="absolute -top-7"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						Variables:
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{Object.entries(variables).map(([key, value]) => (
					<motion.div
						initial={{ opacity: 0, x: -150 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -150 }}
						transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
						layoutId={key}
						key={key}
						className="flex flex-row justify-between gap-2 rounded-md overflow-clip w-max"
						style={{ backgroundColor: theme.dark ? "#002b36" : "#eee8d5" }}
					>
						<span className="pl-2">{key}</span>
						<span
							className="px-2 grow"
							style={{ backgroundColor: theme.dark ? "#073642" : "#fdf6e3" }}
						>
							{valueToText(value)}
						</span>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

interface ConsoleLinesProps {
	consoleLine: string;
	index: number;
}

const ConsoleLinesPanel: React.FC<ConsoleLinesProps> = ({
	consoleLine,
	index,
}) => {
	const theme = useContext(ThemeContext);

	return (
		<div className="absolute flex flex-row items-start gap-2 top-full">
			<AnimatePresence mode="wait">
				<motion.div
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30 }}
					transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
					layoutId={`console-line-${index}`}
					key={index}
					className="flex flex-row justify-between gap-2 rounded-sm"
					style={{ backgroundColor: theme.dark ? "#073642" : "#fdf6e3" }}
				>
					<span className="px-2">{consoleLine}</span>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export function valueToText(value: any) {
	if (typeof value === "boolean") {
		return value ? "true" : "false";
	} else if (typeof value === "string") {
		return value;
	} else if (typeof value === "number") {
		return value.toString();
	} else if (Array.isArray(value)) {
		return value.join(", ");
	}
}
