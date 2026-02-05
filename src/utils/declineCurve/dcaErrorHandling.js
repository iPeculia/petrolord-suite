/**
 * Validates inputs before running DCA fit
 */
export const validateFitInput = (data, fitWindow, modelType) => {
  const errors = [];

  if (!data || data.length === 0) {
    return { valid: false, error: "No production data available for this well." };
  }

  // Validate Fit Window
  if (fitWindow) {
    if (fitWindow.startDate && fitWindow.endDate) {
      const start = new Date(fitWindow.startDate);
      const end = new Date(fitWindow.endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { valid: false, error: "Invalid fit window dates." };
      }
      
      if (start >= end) {
        return { valid: false, error: "Fit window start date must be before end date." };
      }

      // Check if any data exists in window
      const pointsInWindow = data.filter(d => {
        const t = new Date(d.date);
        return t >= start && t <= end && d.rate > 0;
      });

      if (pointsInWindow.length < 5) {
        return { valid: false, error: `Insufficient data points in selected window (${pointsInWindow.length}). Need at least 5.` };
      }
    } else {
       // No window defined, check total data
       const validPoints = data.filter(d => d.rate > 0);
       if (validPoints.length < 5) {
         return { valid: false, error: "Insufficient valid production data points. Need at least 5 positive rate records." };
       }
    }
  }

  // Validate Model Type
  if (!modelType) {
    return { valid: false, error: "Please select a decline model type." };
  }

  return { valid: true };
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return "An unexpected error occurred during analysis.";
};