// This file is now a placeholder as all calculations are performed on the backend.
// The frontend will now receive the fully processed data.

export const processWaterfloodData = async (csvText, filters, useSample = false) => {
  // This function is now deprecated on the client.
  // The logic has been moved to the backend API.
  // This is kept for reference but should not be used.
  console.warn("processWaterfloodData is deprecated on the client.");
  return {};
};

export const calculateKPIs = (processedData) => {
  // This function is now deprecated on the client.
  console.warn("calculateKPIs is deprecated on the client.");
  return {};
};

export const generateInsights = (processedData, kpis) => {
  // This function is now deprecated on the client.
  console.warn("generateInsights is deprecated on the client.");
  return [];
};

export const validateCSVData = (csvText) => {
  // This function is now deprecated on the client.
  console.warn("validateCSVData is deprecated on the client.");
  return true; // Assume backend will handle validation
};