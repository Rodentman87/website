import { useEffect, useState } from "react";

export const useSessionState = <T>(
	key: string,
	initialValue: T,
	clearOnRefresh = false
) => {
	const [value, setValue] = useState(() => {
		if (typeof window === "undefined") return initialValue;
		const storedValue = sessionStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : initialValue;
	});

	useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	useEffect(() => {
		if (clearOnRefresh && typeof window !== "undefined") {
			const handler = () => {
				sessionStorage.removeItem(key);
			};
			window.addEventListener("beforeunload", handler);
			return () => window.removeEventListener("beforeunload", handler);
		}
	}, [key, clearOnRefresh]);

	return [value, setValue] as const;
};
