import React, { useEffect, useRef } from "react";

export const Starfield: React.FC<{ starCount: number }> = ({ starCount }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const filled = useRef(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container || filled.current) return;

		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;

		const ctx = canvas.getContext("2d");
		for (let i = 0; i < starCount; i++) {
			ctx.beginPath();
			const color = Math.random() * 200 + 55;
			ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
			ctx.arc(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				Math.random() * 2,
				0,
				2 * Math.PI
			);
			ctx.fill();
		}
		filled.current = true;
	}, [canvasRef.current]);

	return (
		<div ref={containerRef} className=" absolute top-0 left-0 w-full h-full">
			<canvas ref={canvasRef} />
		</div>
	);
};
