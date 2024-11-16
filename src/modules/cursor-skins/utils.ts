import { CursorSource } from "./CursorSkinStore";

export function sourceToStyle(source: CursorSource) {
	return `url(${source.src}) ${
		source.hotspot ? `${source.hotspot.x} ${source.hotspot.y}` : ""
	}`;
}
