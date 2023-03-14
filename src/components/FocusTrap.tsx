import React, { useEffect } from "react";

interface FocusTrapProps {
	firstFocusRef: React.RefObject<HTMLElement>;
	lastFocusRef: React.RefObject<HTMLElement>;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
	firstFocusRef,
	lastFocusRef,
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				if (e.shiftKey) {
					if (document.activeElement === firstFocusRef.current) {
						e.preventDefault();
						lastFocusRef.current?.focus();
					}
				} else {
					if (document.activeElement === lastFocusRef.current) {
						e.preventDefault();
						firstFocusRef.current?.focus();
					}
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [firstFocusRef, lastFocusRef]);

	return null;
};
