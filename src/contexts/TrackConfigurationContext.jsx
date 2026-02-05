import React, { createContext, useContext, useState, useCallback, useReducer } from 'react';
import { useWellCorrelationContext } from '@/contexts/WellCorrelationContext';

const TrackConfigurationContext = createContext();

const DEFAULT_VIEW_SETTINGS = {
  zoom: 1.0,
  verticalScale: 5.0,
  verticalScaleLocked: false,
  fixedRatio: false,
  spacingMode: 'constant',
  spacingValue: 20,
  backgroundColor: '#0f172a',
  backgroundOpacity: 1.0,
};

const DEFAULT_LAYERS = [
  { id: 'grid', name: 'Grid Lines', visible: true, opacity: 0.5 },
  { id: 'logs', name: 'Well Logs', visible: true, opacity: 1.0 },
  { id: 'markers', name: 'Markers', visible: true, opacity: 1.0 },
  { id: 'annotations', name: 'Annotations', visible: true, opacity: 1.0 },
  { id: 'measurements', name: 'Measurements', visible: true, opacity: 1.0 },
];

const DEFAULT_GRID_SETTINGS = {
  vertical: true,
  horizontal: true,
  opacity: 0.2,
  style: 'solid'
};

const historyReducer = (state, action) => {
  const { past, present, future } = state;
  switch (action.type) {
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    case 'PUSH':
      if (action.payload === present) return state;
      return {
        past: [...past, present],
        present: action.payload,
        future: [],
      };
    default:
      return state;
  }
};

export const TrackConfigurationProvider = ({ children }) => {
  const contextValue = useWellCorrelationContext();
  
  // Robust fallback if context is missing
  const { 
    tracks = [], 
    wells = [],
    addTrack = () => {}, 
    removeTrack = () => {}, 
    updateTrack = () => {}, 
    updateTrackWidth = () => {},
    gridSettings: parentGridSettings,      
    setGridSettings: setParentGridSettings    
  } = contextValue || {};

  // Local fallback for grid settings
  const [localGridSettings, setLocalGridSettings] = useState(DEFAULT_GRID_SETTINGS);

  // --- View State ---
  const [viewSettings, setViewSettings] = useState(DEFAULT_VIEW_SETTINGS);
  
  // --- Panel State (New) ---
  const [showAssistant, setShowAssistant] = useState(false);
  const [showQC, setShowQC] = useState(false);
  
  // --- Tool State ---
  const [activeTool, setActiveTool] = useState('select'); 
  
  // --- Data State ---
  const [annotations, setAnnotations] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [importedWells, setImportedWells] = useState([]);
  const [importedLogs, setImportedLogs] = useState([]);
  
  // --- Well State (Extended) ---
  const [wellSettings, setWellSettings] = useState({
    order: [],
    selected: [],
    hidden: [],
    focused: null,
    wellsInCorrelation: [] 
  });

  // --- Log State ---
  const [logCustomization, setLogCustomization] = useState({});

  // --- History Management ---
  const [historyState, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: { annotations, measurements, layers, wellSettings, logCustomization }, 
    future: []
  });

  const pushHistory = useCallback(() => {
    dispatchHistory({ 
      type: 'PUSH', 
      payload: { annotations, measurements, layers, wellSettings, logCustomization } 
    });
  }, [annotations, measurements, layers, wellSettings, logCustomization]);

  const undo = () => {
    if (historyState.past.length > 0) {
      dispatchHistory({ type: 'UNDO' });
      const prev = historyState.past[historyState.past.length - 1];
      setAnnotations(prev.annotations);
      setMeasurements(prev.measurements);
      setLayers(prev.layers);
      setWellSettings(prev.wellSettings);
      setLogCustomization(prev.logCustomization);
    }
  };

  const redo = () => {
    if (historyState.future.length > 0) {
      dispatchHistory({ type: 'REDO' });
      const next = historyState.future[0];
      setAnnotations(next.annotations);
      setMeasurements(next.measurements);
      setLayers(next.layers);
      setWellSettings(next.wellSettings);
      setLogCustomization(next.logCustomization);
    }
  };

  // --- Actions ---
  const addAnnotation = (ann) => {
    pushHistory();
    setAnnotations(prev => [...prev, ann]);
  };

  const removeAnnotation = (id) => {
    pushHistory();
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const addMeasurement = (meas) => {
    pushHistory();
    setMeasurements(prev => [...prev, meas]);
  };

  const clearMeasurements = () => {
    pushHistory();
    setMeasurements([]);
  };

  const toggleLayer = (layerId) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l));
  };

  const setLayerOpacity = (layerId, opacity) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, opacity } : l));
  };

  const updateWellSettings = (updates) => {
    setWellSettings(prev => ({ ...prev, ...updates }));
  };

  const updateViewSettings = (updates) => {
    setViewSettings(prev => ({ ...prev, ...updates }));
  };

  const updateGridSettings = (updates) => {
    if (setParentGridSettings) {
        setParentGridSettings(prev => ({ ...prev, ...updates }));
    } else {
        setLocalGridSettings(prev => ({ ...prev, ...updates }));
    }
  };

  const addWellToCorrelation = (wellId) => {
    if (!wellSettings.wellsInCorrelation.includes(wellId)) {
        updateWellSettings({ 
            wellsInCorrelation: [...wellSettings.wellsInCorrelation, wellId],
            order: [...wellSettings.order, wellId]
        });
    }
  };

  const removeWellFromCorrelation = (wellId) => {
    updateWellSettings({ 
        wellsInCorrelation: wellSettings.wellsInCorrelation.filter(id => id !== wellId),
        order: wellSettings.order.filter(id => id !== wellId)
    });
  };

  // Import functions
  const importWells = (newWells) => {
    setImportedWells(prev => [...prev, ...newWells]);
  };

  const importLogs = (newLogs) => {
    setImportedLogs(prev => [...prev, ...newLogs]);
  };

  const undoImport = () => {
    // Placeholder for undo import
  };

  // Actions
  const setZoom = useCallback((zoom) => updateViewSettings({ zoom }), []);
  const setVerticalScale = useCallback((scale) => updateViewSettings({ verticalScale: scale }), []);
  const toggleScaleLock = useCallback(() => updateViewSettings({ verticalScaleLocked: !viewSettings.verticalScaleLocked }), [viewSettings]);
  const toggleFixedRatio = useCallback(() => updateViewSettings({ fixedRatio: !viewSettings.fixedRatio }), [viewSettings]);
  const resetViewSettings = useCallback(() => setViewSettings(DEFAULT_VIEW_SETTINGS), []);

  // Combine grid settings
  const gridSettings = parentGridSettings || localGridSettings;

  const value = {
    tracks,
    addTrack,
    removeTrack,
    updateTrack,
    updateTrackWidth,
    
    viewSettings,
    updateViewSettings,
    resetViewSettings,
    setZoom,
    setVerticalScale,
    toggleScaleLock,
    toggleFixedRatio,

    wellSettings,
    updateWellSettings,
    addWellToCorrelation,
    removeWellFromCorrelation,

    activeTool,
    setActiveTool,
    
    layers, 
    toggleLayer,
    setLayerOpacity,
    
    gridSettings,
    updateGridSettings,

    annotations,
    addAnnotation,
    removeAnnotation,
    
    measurements,
    addMeasurement,
    clearMeasurements,
    
    logCustomization,
    setLogCustomization,

    importedWells,
    importedLogs,
    importWells,
    importLogs,
    undoImport,

    showAssistant,
    setShowAssistant,
    showQC,
    setShowQC,

    undo,
    redo,
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0
  };

  return (
    <TrackConfigurationContext.Provider value={value}>
      {children}
    </TrackConfigurationContext.Provider>
  );
};

export const useTrackConfigurationContext = () => {
  const context = useContext(TrackConfigurationContext);
  if (!context) {
    return {
        gridSettings: DEFAULT_GRID_SETTINGS,
        layers: DEFAULT_LAYERS,
        updateGridSettings: () => {},
        toggleLayer: () => {},
        viewSettings: DEFAULT_VIEW_SETTINGS,
        tracks: [],
        wellSettings: { wellsInCorrelation: [] },
        showAssistant: false,
        showQC: false,
        setShowAssistant: () => {},
        setShowQC: () => {}
    };
  }
  return context;
};