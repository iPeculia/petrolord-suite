/**
 * Structural Context Service
 * Provides structural information like dip and strike for correlation.
 */

export const getStructuralContext = async (projectId) => {
  // Stub implementation
  console.log("Fetching structural context for project:", projectId);
  return {
    regionalDip: 2, // degrees
    dipDirection: 180, // degrees (South)
    majorFaults: []
  };
};

export const calculateDipBetweenWells = (wellA, wellB, markerId) => {
  // Calculate apparent dip based on marker depths and well coordinates
  // Stub
  return 0; 
};