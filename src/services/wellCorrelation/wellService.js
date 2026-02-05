/**
 * Well Service
 * Operations for managing well data (CRUD).
 */

export const fetchWells = async (projectId) => {
  // Mock fetch
  return [];
};

export const saveWell = async (well) => {
  // Mock save
  console.log("Saving well:", well.name);
  return well;
};

export const updateWellMetadata = async (wellId, metadata) => {
  // Mock update
  console.log("Updating metadata for:", wellId);
  return true;
};