import { createContext, useContext } from "react";
import { CursorSkinStore } from "../CursorSkinStore";

export const CursorSkinStoreContext = createContext(new CursorSkinStore());

export function useCursorSkinStore() {
	return useContext(CursorSkinStoreContext);
}
