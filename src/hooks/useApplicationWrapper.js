import { useEffect } from 'react';
import { useApplicationMode } from '@/hooks/useApplicationMode';

/**
 * Hook to effectively wrap a component logic with application mode settings.
 * Alternative to the ApplicationWrapper component.
 */
export const useApplicationWrapper = (config) => {
  const { setApplicationMode, exitApplicationMode } = useApplicationMode();

  useEffect(() => {
    if (config) {
      setApplicationMode({
        id: config.id,
        name: config.name,
        hideSidebar: config.hideSidebar !== undefined ? config.hideSidebar : true
      });
    }

    return () => {
      exitApplicationMode();
    };
  }, [JSON.stringify(config), setApplicationMode, exitApplicationMode]);
};

export default useApplicationWrapper;