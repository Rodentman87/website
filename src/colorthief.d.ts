declare module "colorthief" {
	type RGB = [number, number, number];
	type Image = HTMLImageElement;

	export default class ColorThief {
		// Image on web, string in Node. It's only a promise when run in Node.
		public getColor(image: Image | string, quality?: number): Promise<RGB>;
		public getPalette(
			image: Image | string,
			colorCount?: number,
			quality?: number
		): Promise<RGB[]>;
	}
}
