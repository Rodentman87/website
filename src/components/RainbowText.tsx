import React from "react";
import styles from "./RainbowText.module.css";

interface WavyRainbowTextProps {
	size: number;
	text: string;
	gradientColors?: string[];
}

const defaultGradient = `linear-gradient(
		to right,
		rgba(223, 0, 0, 1) 2.7%,
		rgba(214, 91, 0, 1) 15.1%,
		rgba(233, 245, 0, 1) 29.5%,
		rgba(23, 255, 17, 1) 45.8%,
		rgba(29, 255, 255, 1) 61.5%,
		rgba(5, 17, 255, 1) 76.4%,
		rgba(202, 0, 253, 1) 92.4%
	)`;

export const WavyRainbowText: React.FC<WavyRainbowTextProps> = ({
	size,
	text,
	gradientColors,
}) => {
	let gradient = defaultGradient;
	if (gradientColors) {
		gradient = `linear-gradient(
			to right,
			${gradientColors
				.map((color, index) => {
					return `${color} ${(index / (gradientColors.length - 1)) * 100}%`;
				})
				.join(", ")}
		)`;
	}

	return (
		<span
			className={"bg-clip-text"}
			style={
				{
					["--size"]: size,
					["--speed"]: "3s",
					backgroundImage: gradient,
				} as React.CSSProperties
			}
		>
			{text.split("").map((char, i) => (
				<span
					className={styles.wave}
					style={
						{
							["--index"]: i * 4,
							display: "inline-block",
							minWidth: char === " " ? "1ch" : undefined,
							color: "transparent",
						} as React.CSSProperties
					}
					key={i}
				>
					{char}
				</span>
			))}
		</span>
	);
};
