import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calculateBHAProperties, generateMockWellProfile, estimateContactForce } from '../utils/contactForceCalculations';
import { generateWearProfile } from '../utils/wearCalculations';
import { identifyHighRiskZones } from '../utils/riskZoneAnalysis';
import { createScenario } from '../utils/scenarioEngine';
import { createProject, listProjects, saveProjectsToStorage, updateProjectInStorage, createVersion } from '../utils/projectManagement';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const CasingWearAnalyzerContext = createContext();

export const useCasingWearAnalyzer = () => useContext(CasingWearAnalyzerContext);

export const CasingWearAnalyzerProvider = ({ children }) => {
  const { toast } = useToast();

  // --- Constants & Defaults ---
  const DEFAULT_OPERATION = {
    type: 'Rotary Drilling',
    bhaName: 'Vertical Well - Rotary',
    drillPipe: { size: 5.0, grade: 'G-105', weight: 19.5, length: 3000 },
    hwdp: { size: 5.0, weight: 49.5, count: 12 },
    drillCollars: { od: 6.75, id: 2.25, weight: 147, count: 6 },
    toolJoints: { od: 6.5, length: 0.5 }
  };

  const DEFAULT_MUD = {
    density: 12.5,
    viscosity: 65,
    frictionFactor: 0.25,
    wearFactorTJ: 1.0,
    wearFactorPB: 0.5
  };

  const DEFAULT_EXPOSURE = {
    rotatingHours: 48,
    slidingHours: 12,
    trips: 2,
    backreamingPasses: 0,
    ropSliding: 30,
    rpm: 120
  };

  // --- State ---
  // Layout & UI State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(() => {
    const saved = localStorage.getItem('casingWearAnalyzer_leftPanelCollapsed');
    return saved === null ? true : saved !== 'true'; // stored as 'collapsed' = 'true'
  });
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    const saved = localStorage.getItem('casingWearAnalyzer_rightPanelCollapsed');
    return saved === null ? true : saved !== 'true';
  });
  
  const [activeTab, setActiveTab] = useState('inputs');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);

  // Core Inputs
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [wells, setWells] = useState([]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [casingStrings, setCasingStrings] = useState([]);
  const [selectedCasingString, setSelectedCasingString] = useState(null);
  const [drillingPrograms, setDrillingPrograms] = useState([]);
  const [selectedDrillingProgram, setSelectedDrillingProgram] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);

  // Detailed Params
  const [operationParams, setOperationParams] = useState(DEFAULT_OPERATION);
  const [mudParams, setMudParams] = useState(DEFAULT_MUD);
  const [exposureParams, setExposureParams] = useState(DEFAULT_EXPOSURE);
  const [conservativeMultiplier, setConservativeMultiplier] = useState(1.0);
  
  // UX State
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [uiPreferences, setUiPreferences] = useState({
    showTooltips: true,
    showOriginalCapacities: false,
    showWornCapacities: true,
  });
  
  // Results State (Explicitly calculated)
  const [wearProfileResult, setWearProfileResult] = useState(null);
  const [riskZonesResult, setRiskZonesResult] = useState([]);
  
  // Scenarios
  const [scenarios, setScenarios] = useState([]);

  // --- Panel Toggles ---
  const toggleLeftPanel = useCallback(() => {
    setIsLeftPanelOpen(prev => {
      const newState = !prev;
      localStorage.setItem('casingWearAnalyzer_leftPanelCollapsed', (!newState).toString());
      return newState;
    });
  }, []);

  const toggleRightPanel = useCallback(() => {
    setIsRightPanelOpen(prev => {
      const newState = !prev;
      localStorage.setItem('casingWearAnalyzer_rightPanelCollapsed', (!newState).toString());
      return newState;
    });
  }, []);

  // --- Derived Calculations (Live Updates for Inputs) ---
  const derivedLoads = useMemo(() => {
    if (!selectedWell || !selectedCasingString || !operationParams || !operationParams.drillPipe) {
        return { bhaSummary: { totalWeight: 0, totalLength: 0, toolJointCount: 0 }, profileData: [] };
    }
    const bhaSummary = calculateBHAProperties(operationParams);
    const wellProfile = generateMockWellProfile(selectedWell.depth);
    const profileData = estimateContactForce(wellProfile, operationParams, selectedCasingString);
    return { bhaSummary, profileData };
  }, [operationParams, selectedWell, selectedCasingString]);

  // --- Calculation Action ---
  const runCalculation = async () => {
    // 1. Validation
    const errors = [];
    if (!selectedWell) errors.push("No Well selected.");
    if (!selectedCasingString) errors.push("No Casing String selected.");
    if (!operationParams?.drillPipe?.size) errors.push("Drill Pipe configuration incomplete.");
    
    // Validate BHA
    const bhaValid = operationParams.hwdp?.count > 0 || operationParams.drillCollars?.count > 0 || operationParams.drillPipe?.length > 0;
    if (!bhaValid) errors.push("BHA Composition is empty.");

    // Validate Mud
    if (!mudParams.density || mudParams.density <= 0) errors.push("Mud Density required.");
    if (!mudParams.viscosity || mudParams.viscosity <= 0) errors.push("Mud Viscosity required.");
    if (mudParams.frictionFactor === undefined || mudParams.frictionFactor < 0) errors.push("Friction Factor required.");
    
    // Validate Wear Factors
    if (!mudParams.wearFactorTJ || mudParams.wearFactorTJ <= 0) errors.push("Wear Factor (Tool Joint) required.");
    
    // Validate Exposure
    if ((!exposureParams.rotatingHours || exposureParams.rotatingHours <= 0) && (!exposureParams.slidingHours || exposureParams.slidingHours <= 0)) {
        errors.push("Exposure time (rotating or sliding) required.");
    }

    if (errors.length > 0) {
      toast({
        title: "Validation Failed",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    // 2. Start Calculation
    setIsCalculating(true);
    setCalculationProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setCalculationProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 100);

    try {
      // Simulate heavy compute delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(interval);
      setCalculationProgress(100);

      // 3. Execute Core Logic
      const profile = generateWearProfile({
        casingData: selectedCasingString,
        contactForceProfile: derivedLoads.profileData,
        mudParams,
        exposureParams,
        conservativeMultiplier,
      });

      const risks = identifyHighRiskZones(profile, selectedCasingString, operationParams, derivedLoads, { riskScore: 25 });

      setWearProfileResult(profile);
      setRiskZonesResult(risks);
      
      toast({
        title: "Calculation Complete",
        description: "Wear profile and risk zones updated successfully.",
        className: "bg-emerald-900 border-emerald-800 text-white"
      });

      setTimeout(() => {
        setIsCalculating(false);
        setCalculationProgress(0);
        setActiveTab('profile'); // Auto-switch to results
      }, 500);

    } catch (error) {
      console.error("Calculation error", error);
      clearInterval(interval);
      setIsCalculating(false);
      toast({
        title: "Calculation Error",
        description: "An error occurred during analysis.",
        variant: "destructive"
      });
    }
  };

  // --- Undo/Redo Stack ---
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const saveToUndo = useCallback(() => {
    const currentState = {
        operationParams: JSON.parse(JSON.stringify(operationParams)),
        mudParams: JSON.parse(JSON.stringify(mudParams)),
        exposureParams: JSON.parse(JSON.stringify(exposureParams)),
        conservativeMultiplier
    };
    setUndoStack(prev => {
        // Only push if different from last state to avoid duplicates on fast typing
        const last = prev[prev.length - 1];
        if (last && JSON.stringify(last) === JSON.stringify(currentState)) return prev;
        return [...prev.slice(-19), currentState];
    });
    setRedoStack([]);
  }, [operationParams, mudParams, exposureParams, conservativeMultiplier]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    // Save current state to redo before undoing
    const currentState = {
        operationParams: JSON.parse(JSON.stringify(operationParams)),
        mudParams: JSON.parse(JSON.stringify(mudParams)),
        exposureParams: JSON.parse(JSON.stringify(exposureParams)),
        conservativeMultiplier
    };
    setRedoStack(prev => [...prev, currentState]);

    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    setOperationParams(previous.operationParams);
    setMudParams(previous.mudParams);
    setExposureParams(previous.exposureParams);
    setConservativeMultiplier(previous.conservativeMultiplier);
    
    toast({ description: "Undo successful" });
  }, [undoStack, operationParams, mudParams, exposureParams, conservativeMultiplier]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    // Save current state to undo before redoing
    const currentState = {
        operationParams: JSON.parse(JSON.stringify(operationParams)),
        mudParams: JSON.parse(JSON.stringify(mudParams)),
        exposureParams: JSON.parse(JSON.stringify(exposureParams)),
        conservativeMultiplier
    };
    setUndoStack(prev => [...prev, currentState]);

    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));

    setOperationParams(next.operationParams);
    setMudParams(next.mudParams);
    setExposureParams(next.exposureParams);
    setConservativeMultiplier(next.conservativeMultiplier);
    
    toast({ description: "Redo successful" });
  }, [redoStack, operationParams, mudParams, exposureParams, conservativeMultiplier]);


  // --- Initial Load ---
  useEffect(() => {
    const mockWells = [{ id: 'w-01', name: 'Adalu-1', depth: 3500 }, { id: 'w-02', name: 'Ofon-West-4', depth: 4200 }];
    setWells(mockWells);
    setSelectedWell(mockWells[0]);
    
    let storedProjects = listProjects();
    if (storedProjects.length === 0) {
        const defaultProj = createProject(mockWells[0], 'Default Analysis', 'Auto-generated project');
        const defaultVer = createVersion(defaultProj.id, 'Base Case', 'Initial setup', {
            operationParams: DEFAULT_OPERATION,
            mudParams: DEFAULT_MUD,
            exposureParams: DEFAULT_EXPOSURE
        });
        defaultProj.versions.push(defaultVer);
        updateProjectInStorage(defaultProj);
        storedProjects = [defaultProj];
    }
    setProjects(storedProjects);
    setActiveProject(storedProjects[0]);
    setVersions(storedProjects[0].versions);
    if(storedProjects[0].versions.length > 0) {
        loadVersion(storedProjects[0].versions[0]);
    }
  }, []);

  // Update Casing Options based on Well
  useEffect(() => {
    if (selectedWell) {
        const mockCasings = [
            { id: 'cs-01', name: 'Surface Casing (13-3/8")', od: 13.375, id_val: 12.415, grade: 'K-55', weight: 68, top: 0, bottom: 1200, burst: 3450, collapse: 1950 }, 
            { id: 'cs-02', name: 'Intermediate Casing (9-5/8")', od: 9.625, id_val: 8.535, grade: 'L-80', weight: 47, top: 0, bottom: 2800, burst: 6870, collapse: 4760 }
        ];
        setCasingStrings(mockCasings);
        setSelectedCasingString(mockCasings[1]);
        const mockPrograms = [{ id: 'dp-01', name: '8.5" Hole Section', operation: 'Drilling', bitSize: 8.5, wob: 25, rpm: 120 }];
        setDrillingPrograms(mockPrograms);
        setSelectedDrillingProgram(mockPrograms[0]);
    }
  }, [selectedWell]);

  // --- Project Actions ---
  const loadVersion = (version) => {
      if(!version) return;
      setActiveVersionId(version.id);
      if(version.data) {
          if(version.data.operationParams) setOperationParams(version.data.operationParams);
          if(version.data.mudParams) setMudParams(version.data.mudParams);
          if(version.data.exposureParams) setExposureParams(version.data.exposureParams);
          // Reset results on version load to ensure consistency
          setWearProfileResult(null);
          setRiskZonesResult([]);
      }
  };

  const createNewVersion = (name, notes) => {
      if(!activeProject) return;
      const currentData = { operationParams, mudParams, exposureParams };
      const newVer = createVersion(activeProject.id, name, notes, currentData);
      
      const updatedProject = { ...activeProject, versions: [...activeProject.versions, newVer], modified: new Date().toISOString() };
      updateProjectInStorage(updatedProject);
      
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setActiveProject(updatedProject);
      setVersions(updatedProject.versions);
      setActiveVersionId(newVer.id);
      toast({ title: "Version Created", description: `Version "${name}" saved.` });
  };

  const updateCurrentVersion = () => {
      if(!activeProject || !activeVersionId) return;
      const updatedVersions = activeProject.versions.map(v => {
          if(v.id === activeVersionId) {
              return { 
                  ...v, 
                  data: { operationParams, mudParams, exposureParams },
                  modified: new Date().toISOString(),
                  status: 'Saved'
              };
          }
          return v;
      });
      const updatedProject = { ...activeProject, versions: updatedVersions, modified: new Date().toISOString() };
      updateProjectInStorage(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setActiveProject(updatedProject);
      setVersions(updatedVersions);
      toast({ title: "Saved", description: "Current version updated." });
  };

  const createNewScenario = (name, modifications) => {
    if (!activeVersionId) return;
    const baseCaseState = { 
        operationParams, mudParams, exposureParams, 
        selectedCasingString, derivedLoads, wearProfile: wearProfileResult, riskZones: riskZonesResult, conservativeMultiplier 
    };
    const newScenarioData = createScenario(name, baseCaseState, modifications);
    setScenarios(prev => [...prev, { ...newScenarioData, baseCaseId: activeVersionId }]);
  };

  const deleteScenario = (id) => setScenarios(prev => prev.filter(s => s.id !== id));

  // --- Exposed Values ---
  const value = {
    // UI
    isLeftPanelOpen, toggleLeftPanel,
    isRightPanelOpen, toggleRightPanel,
    activeTab, setActiveTab,
    isCalculating, calculationProgress, runCalculation,

    // Core Data
    wells, selectedWell, setSelectedWell,
    casingStrings, setCasingStrings, selectedCasingString, setSelectedCasingString,
    drillingPrograms, setDrillingPrograms, selectedDrillingProgram, setSelectedDrillingProgram,
    
    // Project/Version Mgmt
    projects, activeProject, setActiveProject,
    versions, activeVersionId, loadVersion, createNewVersion, updateCurrentVersion,
    
    // Detailed State
    operationParams, setOperationParams,
    mudParams, setMudParams,
    exposureParams, setExposureParams,
    derivedLoads, 
    wearProfile: wearProfileResult, 
    riskZones: riskZonesResult,
    conservativeMultiplier, setConservativeMultiplier,
    
    // Scenarios
    scenarios, createNewScenario, deleteScenario,

    // UX
    zoomLevel, setZoomLevel, resetView: () => setZoomLevel(1.0),
    uiPreferences, toggleUiPreference: (key) => setUiPreferences(p => ({...p, [key]: !p[key]})),
    
    // Undo/Redo
    saveToUndo, undo, redo, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0,
    
    // Compatibility wrappers
    activeWearCase: versions.find(v => v.id === activeVersionId) || null,
    wearCases: versions,
    setActiveWearCase: (v) => loadVersion(v),
    createNewCase: () => createNewVersion(`New Case ${versions.length + 1}`, ''),
    duplicateCase: () => createNewVersion(`${versions.find(v => v.id === activeVersionId)?.name} (Copy)`, ''),
    saveCase: updateCurrentVersion,
    deleteCase: (id) => {
        if(!activeProject) return;
        const updatedVersions = activeProject.versions.filter(v => v.id !== id);
        const updatedProject = { ...activeProject, versions: updatedVersions };
        updateProjectInStorage(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setActiveProject(updatedProject);
        setVersions(updatedVersions);
        if(id === activeVersionId && updatedVersions.length > 0) loadVersion(updatedVersions[0]);
    }
  };

  return (
    <CasingWearAnalyzerContext.Provider value={value}>
      {children}
    </CasingWearAnalyzerContext.Provider>
  );
};