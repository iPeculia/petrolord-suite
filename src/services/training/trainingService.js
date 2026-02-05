import { trainingCourses } from '@/data/trainingCourses';

export const trainingService = {
  getCourses: async () => {
    return new Promise(resolve => setTimeout(() => resolve(trainingCourses), 100));
  },

  getCourse: async (id) => {
    return new Promise(resolve => setTimeout(() => resolve(trainingCourses.find(c => c.id === id)), 100));
  }
};