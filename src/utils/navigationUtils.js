/**
 * Navigation utilities for EarthModel Pro
 */

export const navigateToDashboard = (navigate) => {
  if (navigate) {
    navigate('/dashboard/geoscience');
  } else {
    window.location.href = '/dashboard/geoscience';
  }
};

export const handleUnsavedChanges = (isDirty) => {
  if (isDirty) {
    return window.confirm("You have unsaved changes. Are you sure you want to leave?");
  }
  return true;
};

export const saveStateToStorage = (key, state) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const restoreStateFromStorage = (key) => {
  try {
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : null;
  } catch (e) {
    console.error("Failed to restore state", e);
    return null;
  }
};