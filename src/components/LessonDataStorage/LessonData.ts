export class LessonCompletionData {
	lessonId: string;
	lessonsCompleted: number[];

	constructor(lessonId: string, lessonsCompleted: number[]) {
		this.lessonId = lessonId;
		this.lessonsCompleted = lessonsCompleted;
	}

	isLessonCompleted(lessonId: number) {
		return this.lessonsCompleted.includes(lessonId);
	}

	markLessonCompleted(lessonId: number) {
		if (!this.isLessonCompleted(lessonId)) {
			this.lessonsCompleted.push(lessonId);
		}
		this.saveToLocalStorage();
	}

	serialize() {
		return {
			lessonId: this.lessonId,
			lessonsCompleted: this.lessonsCompleted,
		};
	}

	saveToLocalStorage() {
		localStorage.setItem(this.lessonId, JSON.stringify(this.serialize()));
	}

	static loadFromLocalStorage(lessonId: string) {
		if (typeof window === "undefined")
			return new LessonCompletionData(lessonId, []);
		const data = localStorage.getItem(lessonId);
		if (data) {
			const parsedData = JSON.parse(data);
			return new LessonCompletionData(
				parsedData.lessonId,
				parsedData.lessonsCompleted
			);
		}
		return new LessonCompletionData(lessonId, []);
	}
}
