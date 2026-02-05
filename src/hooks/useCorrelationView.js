import { useCallback } from 'react';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';

export const useCorrelationView = () => {
  const {
    viewSettings,
    updateViewSettings,
    resetViewSettings,
    setZoom,
    setVerticalScale,
    toggleScaleLock,
    toggleFixedRatio
  } = useTrackConfigurationContext();

  // Zoom Helpers
  const zoomIn = useCallback(() => {
    setZoom(Math.min(5.0, viewSettings.zoom * 1.1));
  }, [viewSettings.zoom, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(Math.max(0.1, viewSettings.zoom / 1.1));
  }, [viewSettings.zoom, setZoom]);

  const zoomToFit = useCallback(() => {
    // Logic to calculate fit would ideally go here or be handled by the panel
    // For now, resetting to 100% or a calculated value
    setZoom(1.0);
    // A real implementation would calculate available width / total content width
  }, [setZoom]);

  const resetView = useCallback(() => {
    resetViewSettings();
  }, [resetViewSettings]);

  // Background Helpers
  const setBackground = useCallback((color) => {
    updateViewSettings({ backgroundColor: color });
  }, [updateViewSettings]);

  const setBackgroundOpacity = useCallback((opacity) => {
    updateViewSettings({ backgroundOpacity: opacity });
  }, [updateViewSettings]);

  // Spacing Helpers
  const setSpacingMode = useCallback((mode) => {
    updateViewSettings({ spacingMode: mode });
  }, [updateViewSettings]);

  const setSpacingValue = useCallback((value) => {
    updateViewSettings({ spacingValue: value });
  }, [updateViewSettings]);

  return {
    ...viewSettings,
    updateViewSettings,
    resetView,
    
    // Zoom
    zoomIn,
    zoomOut,
    zoomToFit,
    setZoom,
    
    // Scale
    setVerticalScale,
    toggleScaleLock,
    toggleFixedRatio,
    
    // Background
    setBackground,
    setBackgroundOpacity,
    
    // Spacing
    setSpacingMode,
    setSpacingValue
  };
};