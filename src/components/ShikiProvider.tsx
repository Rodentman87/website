import React from "react";
import { Highlighter } from "shiki";

export const ShikiContext = React.createContext<Highlighter>(null);

export const useShikiHighlighter = () => {
	const highlighter = React.useContext(ShikiContext);

	return highlighter;
};
