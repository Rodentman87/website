import { useFancyEffects } from "hooks/useFancyEffect";
import React, { useEffect, useRef } from "react";

export const Starfield: React.FC<{
	starCount: number;
	addDustCloud?: boolean;
	dustCloudResolution?: number;
}> = ({ starCount, addDustCloud, dustCloudResolution }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fillState = useRef({
		filling: false,
		filled: false,
	});
	const [shouldShowFancy] = useFancyEffects();

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (
			!canvas ||
			!container ||
			fillState.current.filling ||
			fillState.current.filled
		)
			return;

		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;

		const ctx = canvas.getContext("2d");
		// Draw stars
		for (let i = 0; i < starCount; i++) {
			ctx.beginPath();
			const color = Math.random() * 150 + 105;
			ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
			ctx.arc(
				Math.random() * (canvas.width - 8) + 4,
				Math.random() * (canvas.height - 8) + 4,
				Math.random() * 2.5,
				0,
				2 * Math.PI
			);
			ctx.fill();
		}
		// Draw dust cloud
		if (addDustCloud && shouldShowFancy) {
			const resolution = dustCloudResolution || 40;
			const perlinGrid = createPerlinGrid(
				Math.ceil(canvas.width / resolution),
				Math.ceil(canvas.height / resolution)
			);
			for (let x = 0; x < canvas.width; x++) {
				for (let y = 0; y < canvas.height; y++) {
					const perlinValue = getPerlinValueAtPoint(
						perlinGrid,
						x / resolution,
						y / resolution
					);
					if (perlinValue > 0.2) {
						ctx.fillStyle = `rgba(123, 50, 207, ${perlinValue - 0.2})`;
						ctx.fillRect(x, y, 1, 1);
					}
				}
			}
		}
		fillState.current.filling = false;
		fillState.current.filled = true;
	}, [canvasRef.current]);

	return (
		<div ref={containerRef} className="absolute top-0 left-0 w-full h-full ">
			<canvas ref={canvasRef} />
		</div>
	);
};

function smootherStep(t: number) {
	return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
}

function interpolateSmootherstep(a: number, b: number, t: number) {
	return a + smootherStep(t) * (b - a);
}

function randomUnitVector(): [number, number] {
	const theta = Math.random() * 2 * Math.PI;
	return [Math.cos(theta), Math.sin(theta)];
}

function createPerlinGrid(width: number, height: number) {
	const grid: Array<Array<[number, number]>> = [];
	for (let x = 0; x < width + 1; x++) {
		grid.push([]);
		for (let y = 0; y < height + 1; y++) {
			if (x === 0 || y === 0) grid[x].push([0, 0]);
			else if (x >= width - 1 || y >= height) grid[x].push([0, 0]);
			else grid[x].push(randomUnitVector());
		}
	}
	return grid;
}

function dotProductGrid(
	grid: Array<Array<[number, number]>>,
	x: number,
	y: number,
	gridX: number,
	gridY: number
) {
	const distanceVector = [x - gridX, y - gridY];
	const gradientVector = grid[gridX][gridY];
	return (
		distanceVector[0] * gradientVector[0] +
		distanceVector[1] * gradientVector[1]
	);
}

function getPerlinValueAtPoint(
	grid: Array<Array<[number, number]>>,
	x: number,
	y: number
) {
	const x0 = Math.floor(x);
	const x1 = x0 + 1;
	const y0 = Math.floor(y);
	const y1 = y0 + 1;

	const topLeft = dotProductGrid(grid, x, y, x0, y0);
	const topRight = dotProductGrid(grid, x, y, x1, y0);
	const bottomLeft = dotProductGrid(grid, x, y, x0, y1);
	const bottomRight = dotProductGrid(grid, x, y, x1, y1);

	const topRowInterp = interpolateSmootherstep(topLeft, topRight, x - x0);
	const bottomRowInterp = interpolateSmootherstep(
		bottomLeft,
		bottomRight,
		x - x0
	);
	const verticalInterp = interpolateSmootherstep(
		topRowInterp,
		bottomRowInterp,
		y - y0
	);

	return verticalInterp;
}
