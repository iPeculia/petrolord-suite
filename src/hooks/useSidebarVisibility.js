import { useState, useEffect } from 'react';
import { useApplicationMode } from './useApplicationMode';

/**
 * Hook for components that need to know about sidebar visibility state
 */
export const useSidebarVisibility = () => {
  const { isInApplication } = useApplicationMode();
  const [isVisible, setIsVisible] = useState(!isInApplication);

  useEffect(() => {
    setIsVisible(!isInApplication);
  }, [isInApplication]);

  return {
    isVisible,
    isHidden: !isVisible,
    isApplicationMode: isInApplication
  };
};

export default useSidebarVisibility;