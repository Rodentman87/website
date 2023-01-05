import { useMemo } from "react";
import { LessonCompletionData } from "./LessonData";

export function useLessonData(lessonId: string) {
	const lessonData = useMemo(() => {
		return LessonCompletionData.loadFromLocalStorage(lessonId);
	}, [lessonId]);

	return lessonData;
}
