import { useCallback } from 'react';
import { useApplication } from '@/context/ApplicationContext';

/**
 * Hook to manage Application Mode state and actions
 */
export const useApplicationMode = () => {
  const {
    isInApplication,
    currentApplication,
    enterApplicationMode,
    exitApplicationMode,
    applicationName,
    applicationId
  } = useApplication();

  const setApplicationMode = useCallback((config = {}) => {
    enterApplicationMode(config);
  }, [enterApplicationMode]);

  const toggleSidebar = useCallback((forceState) => {
    if (typeof forceState === 'boolean') {
      if (forceState) {
        exitApplicationMode();
      } else {
        enterApplicationMode(currentApplication || { id: 'unknown', hideSidebar: true });
      }
    } else {
      if (isInApplication) {
        exitApplicationMode();
      } else {
        enterApplicationMode(currentApplication || { id: 'unknown', hideSidebar: true });
      }
    }
  }, [isInApplication, currentApplication, enterApplicationMode, exitApplicationMode]);

  return {
    isInApplication,
    currentApplication,
    applicationName,
    applicationId,
    setApplicationMode,
    exitApplicationMode,
    toggleSidebar
  };
};

export default useApplicationMode;