import { CursorSkin } from "./CursorSkinStore";

export const CURSOR_SKINS = [
	{
		id: "stick",
		defaultSrc: {
			src: "/cursors/stick/default.png",
			hotspot: { x: 1, y: 1 },
		},
		pointerSrc: {
			src: "/cursors/stick/pointer.png",
			hotspot: { x: 16, y: 5 },
		},
		notAllowedSrc: {
			src: "/cursors/stick/not-allowed.png",
			hotspot: { x: 8, y: 8 },
		},
	},
	{
		id: "stick-gold",
		defaultSrc: {
			src: "/cursors/stick-gold/default.png",
			hotspot: { x: 1, y: 1 },
		},
		pointerSrc: {
			src: "/cursors/stick-gold/pointer.png",
			hotspot: { x: 16, y: 5 },
		},
		notAllowedSrc: {
			src: "/cursors/stick-gold/not-allowed.png",
			hotspot: { x: 8, y: 8 },
		},
	},
] as const satisfies CursorSkin[];

export type CursorSkinID = (typeof CURSOR_SKINS)[number]["id"];
