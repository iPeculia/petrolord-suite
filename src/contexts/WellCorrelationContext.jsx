import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateWellLogs } from '@/data/wellLogs';

const WellCorrelationContext = createContext();

const initialWells = [
    { id: 'Well-01', name: 'Well-01', totalDepth: 3500 },
    { id: 'Well-02', name: 'Well-02', totalDepth: 3800 },
    { id: 'Well-03', name: 'Well-03', totalDepth: 4200 },
    { id: 'Well-04', name: 'Well-04', totalDepth: 5000 },
    { id: 'Well-05', name: 'Well-05', totalDepth: 6000 },
];

export const WellCorrelationProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [wells, setWells] = useState(initialWells);
    const [tracks, setTracks] = useState([]);
    const [horizons, setHorizons] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [depthRange, setDepthRange] = useState({ min: 0, max: 3500 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);
    const [isLayerVisible, setIsLayerVisible] = useState({ curves: true, fillings: true, grid: true });
    const [gridSettings, setGridSettings] = useState({
        color: '#475569',
        style: 'dotted',
        opacity: 0.5,
        vertical: true,
        horizontal: true,
    });
    
    // Projects Management
    const createProject = useCallback((projectData) => {
        const newProject = { id: uuidv4(), ...projectData, created: new Date().toISOString(), wells: [] };
        setProjects(prev => [...prev, newProject]);
        setCurrentProjectId(newProject.id);
    }, []);

    const setCurrentProject = useCallback((projectId) => {
        setCurrentProjectId(projectId);
    }, []);

    // Wells Management
    const addWell = useCallback((wellData) => {
        const newWell = {
            id: wellData.id || uuidv4(),
            name: wellData.name || 'New Well',
            totalDepth: wellData.totalDepth || 2000,
            logData: wellData.logData || generateWellLogs(wellData.id, 0, wellData.totalDepth, 0.5),
            ...wellData
        };
        setWells(prev => [...prev, newWell]);
    }, []);

    const removeWell = useCallback((wellId) => {
        setWells(prev => prev.filter(w => w.id !== wellId));
    }, []);

    const updateWell = useCallback((wellId, updatedData) => {
        setWells(prev => prev.map(w => w.id === wellId ? { ...w, ...updatedData } : w));
    }, []);
    
    // Tracks Management
    const addTrack = useCallback((trackData) => {
        const newTrack = { id: uuidv4(), ...trackData };
        setTracks(prev => [...prev, newTrack]);
    }, []);

    const removeTrack = useCallback((trackId) => {
        setTracks(prev => prev.filter(t => t.id !== trackId));
    }, []);

    const updateTrack = useCallback((trackId, updatedData) => {
        setTracks(prev => prev.map(t => t.id === trackId ? updatedData : t));
    }, []);

    const updateTrackWidth = useCallback((trackId, width) => {
        setTracks(prev => prev.map(t => (t.id === trackId ? { ...t, width } : t)));
    }, []);

    // Panel Visibility
    const toggleLeftPanel = useCallback(() => setLeftPanelVisible(prev => !prev), []);
    const toggleRightPanel = useCallback(() => setRightPanelVisible(prev => !prev), []);

    // Markers & Horizons
    const addMarker = useCallback((marker) => setMarkers(prev => [...prev, { ...marker, id: uuidv4() }]), []);
    const removeMarker = useCallback((id) => setMarkers(prev => prev.filter(m => m.id !== id)), []);
    const updateMarker = useCallback((id, data) => setMarkers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m)), []);

    const addHorizon = useCallback((horizon) => setHorizons(prev => [...prev, { ...horizon, id: uuidv4() }]), []);
    const removeHorizon = useCallback((id) => setHorizons(prev => prev.filter(h => h.id !== id)), []);
    const updateHorizon = useCallback((id, data) => setHorizons(prev => prev.map(h => h.id === id ? { ...h, ...data } : h)), []);

    const value = useMemo(() => ({
        projects, setProjects, createProject,
        currentProjectId, setCurrentProjectId, setCurrentProject,
        currentProject: projects.find(p => p.id === currentProjectId) || null,
        
        wells, addWell, removeWell, updateWell, setWells,
        availableWells: [], // Placeholder for available wells list
        
        tracks, addTrack, removeTrack, updateTrack, updateTrackWidth,
        
        horizons, setHorizons, addHorizon, removeHorizon, updateHorizon,
        markers, setMarkers, addMarker, removeMarker, updateMarker,
        
        zoom, setZoom,
        depthRange, setDepthRange,
        scrollPosition, setScrollPosition,
        
        leftPanelVisible, setLeftPanelVisible, toggleLeftPanel,
        rightPanelVisible, setRightPanelVisible, toggleRightPanel,
        
        isLayerVisible, setIsLayerVisible,
        gridSettings, setGridSettings,
    }), [
        projects, currentProjectId, wells, tracks, horizons, markers, zoom, depthRange, scrollPosition,
        leftPanelVisible, rightPanelVisible, isLayerVisible, gridSettings,
        createProject, setCurrentProject, addWell, removeWell, updateWell,
        addTrack, removeTrack, updateTrack, updateTrackWidth,
        toggleLeftPanel, toggleRightPanel,
        addMarker, removeMarker, updateMarker, addHorizon, removeHorizon, updateHorizon
    ]);

    return (
        <WellCorrelationContext.Provider value={value}>
            {children}
        </WellCorrelationContext.Provider>
    );
};

// Main hook export required by other modules
export const useWellCorrelationContext = () => {
    const context = useContext(WellCorrelationContext);
    if (!context) {
        throw new Error('useWellCorrelationContext must be used within a WellCorrelationProvider');
    }
    return context;
};

// Alias for backward compatibility with components using the old name directly
export const useWellCorrelation = useWellCorrelationContext;