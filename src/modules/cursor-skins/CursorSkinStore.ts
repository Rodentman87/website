import { CURSOR_SKINS, CursorSkinID } from "./cursorSkinList";

const cursorSkinMap = new Map<string, CursorSkin>();
CURSOR_SKINS.forEach((skin) => {
	cursorSkinMap.set(skin.id, skin);
});

export interface CursorSource {
	src: string;
	hotspot?: { x: number; y: number };
}

export interface CursorSkin {
	id: string;
	defaultSrc: CursorSource;
	pointerSrc: CursorSource;
	notAllowedSrc: CursorSource;
}

export class CursorSkinStore {
	selectedCursorSkin?: string | null;
	selectedCursorSkinSubscribers = new Set<() => void>();
	unlockedCursorSkins: string[] = [];

	constructor() {
		if (typeof window === "undefined") return;
		this.selectedCursorSkin =
			localStorage.getItem("selectedCursorSkin") || null;
		this.subscribeToSelectedCursorSkin =
			this.subscribeToSelectedCursorSkin.bind(this);
		this.selectCursorSkin = this.selectCursorSkin.bind(this);
		this.unlockedCursorSkins = (
			localStorage.getItem("unlockedCursorSkins") ?? "stick"
		).split(",");
	}

	unlockCursorSkin(id: CursorSkinID) {
		if (this.unlockedCursorSkins.includes(id)) return;
		this.unlockedCursorSkins.push(id);
		localStorage.setItem(
			"unlockedCursorSkins",
			this.unlockedCursorSkins.join(",")
		);
	}

	get currentCursorSkin(): CursorSkin | null {
		if (!this.selectedCursorSkin) {
			return null;
		}
		return cursorSkinMap.get(this.selectedCursorSkin) || null;
	}

	subscribeToSelectedCursorSkin(callback: () => void) {
		this.selectedCursorSkinSubscribers.add(callback);
		return () => {
			this.selectedCursorSkinSubscribers.delete(callback);
		};
	}

	selectCursorSkin(id: CursorSkinID | null) {
		console.log("selectCursorSkin", id);
		if (cursorSkinMap.has(id)) {
			if (!this.unlockedCursorSkins.includes(id)) return;
			this.selectedCursorSkin = id;
			localStorage.setItem("selectedCursorSkin", id);
			this.selectedCursorSkinSubscribers.forEach((s) => s());
		} else if (id === null) {
			this.selectedCursorSkin = null;
			localStorage.removeItem("selectedCursorSkin");
			this.selectedCursorSkinSubscribers.forEach((s) => s());
		}
	}
}
