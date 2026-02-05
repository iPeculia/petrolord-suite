import React, { createContext, useContext, useState } from 'react';
import { trainingService } from '@/services/training/trainingService';

const TrainingContext = createContext();

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [progress, setProgress] = useState({});

  const toggleTraining = () => setIsOpen(!isOpen);

  const startCourse = async (courseId) => {
    const course = await trainingService.getCourse(courseId);
    setCurrentCourse(course);
    setActiveModule(course.modules[0]);
    setIsOpen(true);
  };

  const completeModule = (moduleId) => {
    setProgress(prev => ({ ...prev, [moduleId]: true }));
    // Logic to advance to next module
  };

  return (
    <TrainingContext.Provider value={{
      isOpen,
      toggleTraining,
      currentCourse,
      startCourse,
      activeModule,
      setActiveModule,
      progress,
      completeModule
    }}>
      {children}
    </TrainingContext.Provider>
  );
};