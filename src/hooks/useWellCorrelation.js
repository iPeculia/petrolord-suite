import { useWellCorrelationContext } from '@/contexts/WellCorrelationContext';

// Explicitly export all hooks to prevent SyntaxErrors
// Main hook
export const useWellCorrelation = () => {
  return useWellCorrelationContext();
};

// Feature-specific hooks
export const useWellManager = () => {
  const { wells, availableWells, addWell, removeWell, setWells } = useWellCorrelationContext();
  return { wells, availableWells, addWell, removeWell, setWells };
};

export const useProjectManager = () => {
  const { currentProject, projects, createProject, setCurrentProject } = useWellCorrelationContext();
  return { 
    currentProject, 
    projectList: projects, 
    createProject, 
    setCurrentProject,
    openProject: setCurrentProject // Alias for UI consistency
  };
};

export const usePanelVisibility = () => {
  const { 
    leftPanelVisible, 
    rightPanelVisible, 
    toggleLeftPanel, 
    toggleRightPanel 
  } = useWellCorrelationContext();
  return { 
    leftPanelVisible, 
    rightPanelVisible, 
    toggleLeftPanel, 
    toggleRightPanel 
  };
};

export const useMarkers = () => {
  const { markers, addMarker, removeMarker, updateMarker, setMarkers } = useWellCorrelationContext();
  return { markers, addMarker, removeMarker, updateMarker, setMarkers };
};

export const useHorizons = () => {
  const { horizons, addHorizon, removeHorizon, updateHorizon, setHorizons } = useWellCorrelationContext();
  return { horizons, addHorizon, removeHorizon, updateHorizon, setHorizons };
};

export const useCorrelationPanel = () => {
  const { 
    zoom, 
    setZoom, 
    depthRange, 
    setDepthRange, 
    scrollPosition, 
    setScrollPosition 
  } = useWellCorrelationContext();
  
  return { 
    zoom, 
    setZoom, 
    depthRange, 
    setDepthRange, 
    scrollPosition, 
    setScrollPosition 
  };
};