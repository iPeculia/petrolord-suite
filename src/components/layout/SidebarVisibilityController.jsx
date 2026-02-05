import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApplication } from '@/context/ApplicationContext';

const SidebarVisibilityController = () => {
  const location = useLocation();
  const { setIsInApplication } = useApplication();

  useEffect(() => {
    // Define patterns for routes that should be in "App Mode" (hidden sidebar)
    // This covers all /apps/ routes except hubs
    const isAppPath = location.pathname.includes('/apps/');
    const isHubPath = location.pathname.includes('/hub');
    
    // Specific check for Well Correlation Tool and other immersive apps
    const isImmersiveApp = isAppPath && !isHubPath;

    if (isImmersiveApp) {
      setIsInApplication(true);
    } else {
      setIsInApplication(false);
    }
  }, [location.pathname, setIsInApplication]);

  return null; // This component renders nothing, just handles logic
};

export default SidebarVisibilityController;