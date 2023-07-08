import Color from "color";
import ColorThief from "colorthief";

/*
All this code (with a couple modifications by me) is from Square who is super cool, thank you for this.
https://github.com/SquareIsNotCool
*/

interface DebugColorStage {
	stage: string;
	colors: Color[][];
}

type ColorOutput<Debug extends boolean = false> = {
	primary: Color;
	secondary: Color;
} & (Debug extends true
	? {
			stages: DebugColorStage[];
			// eslint-disable-next-line @typescript-eslint/ban-types
	  }
	: {});

type ColorStore<K extends string, Debug extends boolean = false> = {
	src: string;
} & {
	[key in Exclude<K, "src">]: ColorOutput<Debug>;
};

// // Svelte store!!
// function useColors<K extends string, Debug extends boolean = false>(
// 	bgColors: { [key in K]: Color | Color[] },
// 	options?: {
// 		minimumContrastRatio?: number;
// 		debug?: Debug;
// 		useGlobalCache?: boolean;
// 		cacheOnly?: boolean;
// 	}
// ) {
// 	// This should combat race conditions :)
// 	let currentOptions: { src: string | null; cacheOnly: boolean | null } = {
// 		src: null,
// 		cacheOnly: null,
// 	};

// 	const inputSrc = writable<string | null>(null);
// 	const cacheOnly = writable<boolean>(options?.cacheOnly ?? false);

// 	const derivedInput = derived([inputSrc, cacheOnly], ([src, cacheOnly]) => ({
// 		src,
// 		cacheOnly,
// 	}));

// 	const outputColors = readable<ColorStore<K, Debug> | null>(null, (set) => {
// 		const unsubscriber = derivedInput.subscribe(async ({ src, cacheOnly }) => {
// 			if (src === currentOptions.src && currentOptions.cacheOnly == cacheOnly)
// 				return;
// 			currentOptions = { src, cacheOnly };

// 			if (src === null) {
// 				set(null);
// 				return;
// 			}

// 			if (cacheOnly) {
// 				const colors = extractedColorsCache[src];
// 				if (!colors) set(null);
// 				else
// 					set({
// 						...getBestColorsForAllVariants(
// 							colors,
// 							bgColors,
// 							options?.minimumContrastRatio,
// 							options?.debug
// 						),
// 						src,
// 					});
// 				return;
// 			}
// 			const colors = await extractColors(src, options?.useGlobalCache);
// 			const bestColors = getBestColorsForAllVariants(
// 				colors,
// 				bgColors,
// 				options?.minimumContrastRatio,
// 				options?.debug
// 			);
// 			if (currentOptions.src === src) set({ ...bestColors, src });
// 		});

// 		return unsubscriber;
// 	});

// 	return {
// 		setSrc: inputSrc.set,
// 		cacheOnly: cacheOnly,
// 		subscribe: outputColors.subscribe,
// 	};
// }

function getBestColorsForAllVariants<
	K extends string,
	Debug extends boolean = false
>(
	colors: Color[],
	bgColors: Record<K, Color | Color[]>,
	minimumContrastRatio?: number,
	debug?: Debug
) {
	const keys = Object.keys(bgColors) as K[];
	return Object.fromEntries(
		keys.map((k) => [
			k,
			getBestColors<Debug>(colors, bgColors[k], minimumContrastRatio, debug),
		])
	) as { [key in K]: ColorOutput<Debug> };
}

export function getBestColors<Debug extends boolean = false>(
	colors: Color[],
	bgColor: Color | Color[],
	minimumContrastRatio = 4.5 /* WCAG AA for large text */,
	debug?: Debug
): ColorOutput<Debug> {
	const unfilteredColors = [...colors];
	const bgColors = Array.isArray(bgColor) ? bgColor : [bgColor];

	const debugStages: DebugColorStage[] = [
		{
			stage: "Colors returned from color-thief",
			colors: [[...colors]],
		},
	];

	// Filter out colors that don't meet the specified contrast ratio requirements.
	function checkWCAG() {
		colors = colors
			.map((color) => {
				// Before out-right discarding a color, we try to nudge it slightly in case it lies on the very edge of the contrast requirement.
				const failedBgColors = bgColors.filter(
					(x) => color.contrast(x) < minimumContrastRatio
				);
				if (failedBgColors.length > 0) {
					return failedBgColors[0].isLight()
						? color.blacken(0.1)
						: color.whiten(0.1);
				}
				return color;
			})
			.filter((color) =>
				bgColors.every((x) => color.contrast(x) >= minimumContrastRatio)
			);

		debugStages.push({
			stage: `WCAG contrast checks (${minimumContrastRatio}:1)`,
			colors: [[...colors]],
		});
	}
	checkWCAG();

	// If no colors meet our contrast requirements, attempt to nudge colors a bit.
	if (colors.length === 0) {
		colors = unfilteredColors.map((color) => {
			const labValues = color.lab().array();
			return Color.lab(100 - labValues[0], labValues[1], labValues[2]);
		});

		debugStages.push({
			stage:
				"All colors failed contrast checks. Attempting to nudge colors to fit",
			colors: [[...colors]],
		});

		checkWCAG();
	}

	// If we can't nudge any colors to fit, provide a simple black/white.
	if (colors.length === 0) {
		const color = new Color(bgColors[0].isLight() ? "black" : "white");
		debugStages.push({
			stage: "Couldn't nudge any colors to fit. Providing a fallback color",
			colors: [[color]],
		});

		const output: ColorOutput<false> = { primary: color, secondary: color };
		if (debug) (output as ColorOutput<true>).stages = debugStages;
		return output as ColorOutput<Debug>;
	}

	// Put the dominant color aside as use for our primary color.
	let primary = colors.shift() as Color;

	debugStages.push({
		stage: "Set the dominant color aside for use as primary color",
		colors: [[primary], [...colors]],
	});

	// This function uses eucledian distance in LAB colorspace to ditermine the difference between 2 colors.
	function difference(a: Color, b: Color): number {
		const aValues = a.lab().array();
		const bValues = b.lab().array();

		return Math.sqrt(
			aValues
				.map((x, i) => (x - bValues[i]) ** 2)
				.reduce((prev, curr) => prev + curr, 0)
		);
	}

	// Sort colors based on distance to the primary color.
	colors = colors.sort(
		(a, b) => difference(b, primary) - difference(a, primary)
	);

	debugStages.push({
		stage:
			"Sort colors based on Euclidean distance in CIELAB colorspace to primary color",
		colors: [[primary], [...colors]],
	});

	// Pick out "ideal" colors based on percieved saturation.
	const idealColors = colors
		.filter((x) => x.chroma() > 33)
		.filter((x) => x.contrast(primary) > 3);

	debugStages.push({
		stage: 'Pick out "ideal" colors based on percieved saturation',
		colors: [[primary], [...idealColors], [...colors]],
	});

	// Pick the color farthest from the primary as a secondary,
	// and if not enough colors passed the contrast requirement to pick out a secondary, use the primary.
	let secondary = idealColors[0] ?? colors[0] ?? primary;

	debugStages.push({
		stage:
			"Pick out secondary color, and if none applicable, use primary as secondary",
		colors: [[primary, secondary]],
	});

	// If the secondary color has better contrast with the background than the primary, swap.
	if (primary.contrast(bgColors[0]) < secondary.contrast(bgColors[0]))
		[primary, secondary] = [secondary, primary];

	debugStages.push({
		stage:
			"If the secondary color has better contrast with the background than the primary, swap",
		colors: [[primary, secondary]],
	});

	const output: ColorOutput<false> = { primary, secondary };
	if (debug) (output as ColorOutput<true>).stages = debugStages;
	return output as ColorOutput<Debug>;
}

const extractedColorsCache: Record<string, Color[]> = {};
export function extractColors(
	src: string,
	preLoadedImageElement = null,
	useCache = false
): Promise<Color[]> {
	if (useCache && extractedColorsCache[src]) {
		return Promise.resolve(extractedColorsCache[src]);
	}

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		if (!preLoadedImageElement) {
			const imageElement = new Image();
			imageElement.crossOrigin = "anonymous";
			imageElement.src = src;

			const cleanupSignal = new AbortController();

			if (imageElement.complete) {
				const colors = await getColors(imageElement);
				if (useCache) extractedColorsCache[src] = colors;
				resolve(colors);
			}
			imageElement.addEventListener(
				"load",
				async () => {
					cleanupSignal.abort();
					const colors = await getColors(imageElement);
					if (useCache) extractedColorsCache[src] = colors;
					resolve(colors);
				},
				{ signal: cleanupSignal.signal, once: true }
			);

			imageElement.addEventListener(
				"error",
				(error) => {
					cleanupSignal.abort();
					reject(error);
				},
				{ signal: cleanupSignal.signal }
			);
		} else {
			const colors = await getColors(preLoadedImageElement);
			if (useCache) extractedColorsCache[src] = colors;
			resolve(colors);
		}

		async function getColors(img: HTMLImageElement | string) {
			const colorThief = new ColorThief();
			return (await colorThief.getPalette(img)).map((x) => Color.rgb(...x));
		}
	});
}

export function toLabString(color?: Color): string | null {
	if (!color) return null;
	const lab = color.lab().array();
	const alpha = lab.length === 4 ? lab.pop() : 1;
	return `lab(${lab.join(" ")}${alpha !== 1 ? ` / ${alpha}` : ""})`;
}
