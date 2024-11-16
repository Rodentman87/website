import { useSyncExternalStore } from "react";
import { CursorSkin } from "../CursorSkinStore";
import { useCursorSkinStore } from "./useCursorSkinStore";

const useCursorSkin = () => {
	const store = useCursorSkinStore();

	const cursorSkin = useSyncExternalStore<CursorSkin | null>(
		store.subscribeToSelectedCursorSkin,
		() => {
			return store.currentCursorSkin;
		},
		() => {
			return null;
		}
	);

	return {
		cursorSkin,
		cursorSkinId: cursorSkin !== null ? cursorSkin.id : null,
		setCursorSkin: store.selectCursorSkin,
	};
};

export default useCursorSkin;
