import React, { useEffect } from 'react';
import { useApplicationMode } from '@/hooks/useApplicationMode';

/**
 * Wrapper component to force Application Mode for a specific component/route.
 * Useful when you want to ensure the sidebar is hidden without relying solely on route matching.
 */
const ApplicationWrapper = ({ children, appId, appName, hideSidebar = true }) => {
  const { setApplicationMode, exitApplicationMode } = useApplicationMode();

  useEffect(() => {
    setApplicationMode({
      id: appId,
      name: appName,
      hideSidebar: hideSidebar
    });

    return () => {
      exitApplicationMode();
    };
  }, [appId, appName, hideSidebar, setApplicationMode, exitApplicationMode]);

  return (
    <>
      {children}
    </>
  );
};

export default ApplicationWrapper;