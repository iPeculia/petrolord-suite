import { useEffect } from 'react';
import { logSidebarEvent } from '@/utils/sidebarLogger';
import { useApplicationMode } from './useApplicationMode';

export const useSidebarLogging = () => {
  const { isInApplication, currentApplication } = useApplicationMode();

  useEffect(() => {
    logSidebarEvent('Mode Change', { 
      isInApplication, 
      appName: currentApplication?.name 
    });
  }, [isInApplication, currentApplication]);
};