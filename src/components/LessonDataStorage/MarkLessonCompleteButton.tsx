import React from "react";
import { useLessonData } from "@components/LessonDataStorage/useLessonData";

export const MarkLessonCompleteButton: React.FC<{
	courseId: string;
	lessonNumber: number;
}> = ({ courseId: lessonId, lessonNumber }) => {
	const lessonData = useLessonData(lessonId);

	return (
		<button onClick={() => lessonData.markLessonCompleted(lessonNumber)}>
			Mark lesson complete
		</button>
	);
};
