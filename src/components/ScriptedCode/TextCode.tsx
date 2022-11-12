import React, { useMemo } from "react";
import { ScriptedCode, ScriptLine, valueToText } from "./ScriptedCode";

export const CompiledPlaintextCode: React.FC<{ code: string }> = ({ code }) => {
	const script = useMemo(() => {
		return getScriptFromText(code);
	}, [code]);

	return <ScriptedCode code={code} language="plaintext" script={script} />;
};

export function getScriptFromText(text: string) {
	const lines = text.split("\n");
	const steps: ScriptLine[] = [];
	let numLoops = 0;
	let running = true;
	let currentLine = 0;
	let currentVariables: Record<string, any> = {};
	let returnToLine = 0;
	let returnAfterLine = -1;
	while (running) {
		const currentCodeLine = lines[currentLine].trim();
		const stepInfo: ScriptLine = {
			indicateLine: currentLine + 1,
		};
		if (currentCodeLine.startsWith("Say")) {
			if (currentCodeLine.match(/Say what \([a-zA-Z0-9 ]+\) is/)) {
				// Say the value of the variable
				const variable = currentCodeLine.replace(
					/Say what \(([a-zA-Z0-9 ]+)\) is/,
					"$1"
				);
				const value = currentVariables[variable];
				stepInfo.consoleLine = valueToText(value);
			} else {
				const text = currentCodeLine.replace(/Say "(.+?)"/, "$1");
				stepInfo.consoleLine = text;
			}
		} else if (currentCodeLine.startsWith("Remember")) {
			const variable = currentCodeLine.replace(
				/Remember that \(([a-zA-Z0-9 ]+)\) is (.+)/,
				"$1"
			);
			const value = currentCodeLine.replace(
				/Remember that \(([a-zA-Z0-9 ]+)\) is (.+)/,
				"$2"
			);
			currentVariables[variable] = parseValue(value);
		} else if (currentCodeLine.startsWith("Add")) {
			const variable = currentCodeLine.replace(
				/Add (.+) to \(([a-zA-Z0-9 ]+)\)/,
				"$2"
			);
			const value = currentCodeLine.replace(
				/Add (.+) to \(([a-zA-Z0-9 ]+)\)/,
				"$1"
			);
			if (Array.isArray(currentVariables[variable])) {
				currentVariables[variable].push(parseValue(value));
			} else if (typeof currentVariables[variable] === "number") {
				currentVariables[variable] += parseValue(value);
			} else if (typeof currentVariables[variable] === "string") {
				currentVariables[variable] += parseValue(value);
			}
		} else if (currentCodeLine.startsWith("If")) {
			const condition = currentCodeLine.replace(/If (.+?),/, "$1");
			if (evaluateCondition(condition, currentVariables)) {
				stepInfo.replacePointer = "👍";
			} else {
				currentLine += findLengthOfBlock(lines, currentLine);
				stepInfo.replacePointer = "👎";
			}
		} else if (currentCodeLine.startsWith("While")) {
			const condition = currentCodeLine.replace(/While (.+?),/, "$1");
			if (evaluateCondition(condition, currentVariables)) {
				stepInfo.replacePointer = "👍";
				returnToLine = currentLine;
				returnAfterLine = currentLine + findLengthOfBlock(lines, currentLine);
			} else {
				currentLine += findLengthOfBlock(lines, currentLine);
				stepInfo.replacePointer = "👎";
			}
		}

		stepInfo.variables = JSON.parse(JSON.stringify(currentVariables));

		steps.push(stepInfo);

		if (currentLine === returnAfterLine) {
			currentLine = returnToLine;
			returnToLine = 0;
			returnAfterLine = -1;
		} else {
			currentLine++;
		}

		if (currentLine >= lines.length) {
			running = false;
		}
		numLoops++;
		if (numLoops > 100) {
			running = false;
		}
	}
	return steps;
}

function findLengthOfBlock(lines: string[], startLine: number) {
	let numLines = 0;
	const nextLines = lines.slice(startLine + 1);
	while (/^\s+.*/.test(nextLines[numLines])) {
		numLines++;
		if (numLines >= nextLines.length) {
			break;
		}
	}
	return numLines;
}

function evaluateCondition(condition: string, variables: Record<string, any>) {
	const [_, leftText, op, rightText] = condition.match(
		/(.+?) (is greater than|is less than) (.+?)/
	);
	const left = parseValue(leftText, variables);
	const right = parseValue(rightText, variables);
	if (op === "is greater than") {
		if (left > right) {
			return true;
		}
	} else if (op === "is less than") {
		if (left < right) {
			return true;
		}
	}
	return false;
}

function parseValue(value: string, variables: Record<string, any> = {}) {
	if (value.startsWith('"')) {
		return value.replace(/"(.+)"/, "$1");
	} else if (!isNaN(parseFloat(value))) {
		return parseFloat(value);
	} else if (value === "true" || value === "false") {
		return value === "true";
	} else if (value.startsWith("the list")) {
		const values = value
			.replace(/the list (.+)/, "$1")
			.split(/, (?:and)?/)
			.map((word) => word.trim());
		return values.map((val) => parseValue(val));
	} else if (value.startsWith("(")) {
		const variable = value.replace(/\((.+?)\)/, "$1");
		return variables[variable];
	}
}