import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React, { useMemo } from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useShikiHighlighter } from "../ShikiProvider";

export interface ScriptLine {
	indicateLine: number;
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

	const [currentScriptLineNumber, setCurrentScriptLinenumber] =
		React.useState(0);

	const currentScriptLine = script[currentScriptLineNumber];

	const renderedCode = useMemo(() => {
		if (!highlighter) return;
		return highlighter.codeToHtml(code, { lang: language });
	}, [highlighter, code, language]);

	const numberOfLines = useMemo(() => {
		return code.split("\n").length;
	}, [code]);

	return (
		<div className="relative flex flex-col mb-10">
			<LayoutGroup id={id}>
				<div
					className="z-10 flex flex-row"
					style={{
						backgroundColor: "#fdf6e3",
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
											className="absolute left-0 h-full w-96 from-green-200 bg-gradient-to-r"
										/>
									</>
								)}
								<span className="relative z-10">{lineNumber + 1}</span>
							</span>
						))}
					</div>
					<div
						className="z-10"
						dangerouslySetInnerHTML={{ __html: renderedCode }}
					></div>
				</div>
				<Controls
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

interface ControlsProps {
	currentScriptLineNumber: number;
	setCurrentScriptLinenumber: React.Dispatch<React.SetStateAction<number>>;
	scriptLength: number;
}

const Controls: React.FC<ControlsProps> = ({
	currentScriptLineNumber,
	setCurrentScriptLinenumber,
	scriptLength,
}) => {
	return (
		<div
			className="z-10 flex flex-row justify-between px-2"
			style={{ backgroundColor: "#eee8d5" }}
		>
			<button
				aria-label="Previous step"
				disabled={currentScriptLineNumber === 0}
				className="disabled:cursor-not-allowed disabled:text-gray-500"
				onClick={() => setCurrentScriptLinenumber(currentScriptLineNumber - 1)}
			>
				<IoMdArrowRoundBack />
			</button>
			<div className="flex flex-row justify-center px-2 grow">
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
			</div>
			<button
				aria-label="Next step"
				disabled={currentScriptLineNumber === scriptLength - 1}
				className="disabled:cursor-not-allowed disabled:text-gray-500"
				onClick={() => setCurrentScriptLinenumber(currentScriptLineNumber + 1)}
			>
				<IoMdArrowRoundForward />
			</button>
		</div>
	);
};

interface VariablesPanelProps {
	variables: Record<string, any>;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ variables }) => {
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
						style={{ backgroundColor: "#eee8d5" }}
					>
						<span className="pl-2">{key}</span>
						<span className="px-2 grow" style={{ backgroundColor: "#fdf6e3" }}>
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
					style={{ backgroundColor: "#fdf6e3" }}
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
