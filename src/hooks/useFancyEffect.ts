import { useState } from "react";

export function useFancyEffects() {
	const initialValue =
		typeof window !== "undefined" &&
		window.localStorage.getItem("fancyEffects") === "true";
	const [fancyEffects, setFancyEffects] = useState<boolean>(initialValue);

	const setShowFancyEffects = (show: boolean) => {
		window.localStorage.setItem("fancyEffects", show.toString());
		setFancyEffects(show);
	};

	return [fancyEffects, setShowFancyEffects] as const;
}
