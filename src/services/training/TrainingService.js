import { mockCourses } from '@/data/training/mockTrainingData';

export class TrainingService {
    static async getCourses() {
        await new Promise(resolve => setTimeout(resolve, 400));
        return mockCourses;
    }

    static async enroll(courseId) {
        console.log(`Enrolling in course ${courseId}`);
        return true;
    }

    static async updateProgress(courseId, progress) {
        console.log(`Updating progress for ${courseId} to ${progress}%`);
        return true;
    }
}