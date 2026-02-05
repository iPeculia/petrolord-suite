/**
 * Centralized Error Handling
 */

export const handleError = (error, context = '') => {
  console.error(`[MaterialBalancePro] Error in ${context}:`, error);
  
  // Could send to Sentry/LogRocket here
  
  return {
    message: error.message || 'An unexpected error occurred',
    type: error.name || 'Error',
    context
  };
};

export const safeCalculation = (fn, fallback = null) => {
  try {
    return fn();
  } catch (e) {
    handleError(e, 'Calculation');
    return fallback;
  }
};