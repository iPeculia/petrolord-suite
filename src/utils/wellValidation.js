export const validateWellData = (wellData, existingWells = []) => {
  const errors = [];
  
  // Required fields
  if (!wellData.name || wellData.name.trim().length === 0) {
    errors.push("Well name is required.");
  }

  // Name length
  if (wellData.name && wellData.name.length > 50) {
    errors.push("Well name must be less than 50 characters.");
  }

  // Duplicates
  if (existingWells.some(w => w.name.toLowerCase() === wellData.name?.toLowerCase())) {
    errors.push(`A well named "${wellData.name}" already exists in this project.`);
  }

  // Coordinates
  if (wellData.x !== undefined && isNaN(Number(wellData.x))) {
    errors.push("X Coordinate must be a valid number.");
  }
  if (wellData.y !== undefined && isNaN(Number(wellData.y))) {
    errors.push("Y Coordinate must be a valid number.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};