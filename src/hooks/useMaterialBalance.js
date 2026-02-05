import { useContext } from 'react';
import { MaterialBalanceContext } from '@/contexts/MaterialBalanceContext';

export const useMaterialBalance = () => {
  const context = useContext(MaterialBalanceContext);
  
  if (!context) {
    throw new Error('useMaterialBalance must be used within a MaterialBalanceProvider');
  }

  // Helper to check if project is active
  const isProjectLoaded = !!context.currentProject;

  // Helper to get OOIP estimate string
  const getOOIPEstimate = () => {
    if (!context.fittedModels.N) return 'Not estimated';
    return `${(context.fittedModels.N / 1e6).toFixed(2)} MMSTB`;
  };

  return {
    ...context,
    isProjectLoaded,
    getOOIPEstimate
  };
};