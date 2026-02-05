import React, { createContext, useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { calculateDiagnosticData, calculateLinearRegression } from '@/utils/materialBalance/DiagnosticCalculator';
import { calculateOWCMovement, calculateGOCMovement } from '@/utils/materialBalance/ContactMovementEngine';
import { AutoSaveManager } from '@/utils/materialBalance/MBAutoSave';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const MaterialBalanceContext = createContext();

export const useMaterialBalance = () => {
  const context = useContext(MaterialBalanceContext);
  if (context === undefined) {
    throw new Error('useMaterialBalance must be used within a MaterialBalanceProvider');
  }
  return context;
};

export const MaterialBalanceProvider = ({ children }) => {
  const { toast } = useToast();
  
  // --- State ---
  const [currentProject, setCurrentProject] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const [settings, setSettings] = useState({
    theme: 'dark',
    units: 'field',
    decimalPlaces: 2,
    autoSave: true,
    autoSaveInterval: 5,
    showTooltips: true,
    showGrid: true
  });

  // Data State
  const [reservoirMetadata, setReservoirMetadata] = useState({
    name: 'New Reservoir', type: 'oil', driveType: 'depletion',
    area: 1000, thickness: 50, phi: 0.2, Swi: 0.25, cf: 4e-6, cw: 3e-6, cr: 0,
    GOC0: 8000, OWC0: 8500, datum: 8250
  });
  const [productionHistory, setProductionHistory] = useState({ dates: [], Np: [], Gp: [], Wp: [], Wc: [], Rp: [], comments: [] });
  const [pressureData, setPressureData] = useState({ dates: [], Pr: [], Pwf: [], testType: [] });
  const [pvtData, setPvtData] = useState({ pressure: [], Bo: [], Bg: [], Rs: [], Rv: [], mu_o: [], mu_g: [] });
  const [contactObservations, setContactObservations] = useState({ dates: [], measuredGOC: [], measuredOWC: [], method: [] });

  const [diagnosticData, setDiagnosticData] = useState([]);
  const [selectedDriveType, setSelectedDriveType] = useState('volumetric');
  const [regressionResults, setRegressionResults] = useState({});
  const [fittedModels, setFittedModels] = useState({ N: 0, G: 0, m: 0, U: 0 });
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [forecastData, setForecastData] = useState({ pressure: [], production: [], contacts: [] });
  const [contactForecast, setContactForecast] = useState([]);

  const autoSaveManagerRef = useRef(null);

  // --- Persistence Functions (Internal) ---
  const dbListProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('saved_mbal_projects')
      .select('id, project_name, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (error) { console.error('Error listing projects:', error); return []; }
    // Map to expected format
    return data.map(p => ({ ...p, name: p.project_name, lastModifiedDate: p.updated_at }));
  };

  const dbLoadProject = async (id) => {
    const { data, error } = await supabase
      .from('saved_mbal_projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error('Error loading project:', error); return null; }
    
    const inputs = data.inputs_data || {};
    return {
      id: data.id,
      name: data.project_name,
      reservoirMetadata: inputs.reservoirMetadata,
      productionHistory: inputs.productionHistory,
      pressureData: inputs.pressureData,
      pvtData: inputs.pvtData,
      contactObservations: inputs.contactObservations,
      fittedModels: inputs.fittedModels,
      scenarios: inputs.scenarios,
      selectedDriveType: inputs.selectedDriveType,
      lastModifiedDate: data.updated_at
    };
  };

  const dbSaveProject = async (projectData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No user' };

    const inputs_data = {
      reservoirMetadata,
      productionHistory,
      pressureData,
      pvtData,
      contactObservations,
      fittedModels,
      scenarios,
      selectedDriveType
    };

    const payload = {
      user_id: user.id,
      project_name: projectData.name,
      inputs_data,
      results_data: {} // We can store results if needed
    };

    if (projectData.id) payload.id = projectData.id;

    const { data, error } = await supabase
      .from('saved_mbal_projects')
      .upsert(payload)
      .select()
      .single();

    if (error) return { success: false, error };
    return { success: true, data };
  };

  const dbDeleteProject = async (id) => {
    const { error } = await supabase.from('saved_mbal_projects').delete().eq('id', id);
    return { success: !error, error };
  };

  // --- Initialization ---
  useEffect(() => {
    const loadInit = async () => {
      const projects = await dbListProjects();
      setProjectList(projects);
      const storedFavs = localStorage.getItem('mb_favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
      const storedSettings = localStorage.getItem('mb_settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    };
    loadInit();
  }, []);

  // --- Change Detection ---
  useEffect(() => {
    if (currentProject) {
      setHasChanges(true);
      if (autoSaveManagerRef.current) autoSaveManagerRef.current.setDirty(true);
    }
  }, [reservoirMetadata, productionHistory, pressureData, pvtData, contactObservations, fittedModels, scenarios, selectedDriveType]);

  // --- Project Actions ---
  const saveProject = useCallback(async (silent = false) => {
    if (!currentProject) return;
    if (!silent) setIsSaving(true);
    
    const result = await dbSaveProject(currentProject);
    
    if (result.success) {
      setLastSavedTime(new Date());
      setHasChanges(false);
      if (autoSaveManagerRef.current) autoSaveManagerRef.current.setDirty(false);
      
      // Update list
      const list = await dbListProjects();
      setProjectList(list);
      
      if (!silent) toast({ title: "Project Saved", description: "Your work has been saved." });
    } else {
      if (!silent) toast({ title: "Save Failed", description: result.error?.message, variant: "destructive" });
    }
    
    if (!silent) setIsSaving(false);
  }, [currentProject, reservoirMetadata, productionHistory, pressureData, pvtData, contactObservations, fittedModels, scenarios, selectedDriveType, toast]);

  const loadProjectAction = useCallback(async (id) => {
    setIsSaving(true);
    const project = await dbLoadProject(id);
    if (project) {
      setCurrentProject(project);
      setReservoirMetadata(project.reservoirMetadata || {});
      setProductionHistory(project.productionHistory || { dates: [], Np: [] });
      setPressureData(project.pressureData || { dates: [], Pr: [] });
      setPvtData(project.pvtData || { pressure: [] });
      setContactObservations(project.contactObservations || { dates: [] });
      setFittedModels(project.fittedModels || {});
      setScenarios(project.scenarios || []);
      setSelectedDriveType(project.selectedDriveType || 'volumetric');
      setHasChanges(false);
      setLastSavedTime(new Date(project.lastModifiedDate));
      toast({ title: "Project Loaded", description: `Loaded "${project.name}"` });
    }
    setIsSaving(false);
  }, [toast]);

  const createProject = async (name) => {
    // Create a blank project structure
    const newProject = { name };
    // Save it to DB to get an ID
    const result = await dbSaveProject(newProject);
    if (result.success) {
        await loadProjectAction(result.data.id);
        const list = await dbListProjects();
        setProjectList(list);
    }
  };

  const deleteProject = async (id) => {
    await dbDeleteProject(id);
    const list = await dbListProjects();
    setProjectList(list);
    if (currentProject?.id === id) setCurrentProject(null);
    toast({ title: "Project Deleted" });
  };

  // --- Auto Save ---
  useEffect(() => {
    if (!autoSaveManagerRef.current) {
      autoSaveManagerRef.current = new AutoSaveManager(async () => await saveProject(true), settings.autoSave ? settings.autoSaveInterval : 0);
    } else {
      autoSaveManagerRef.current.saveCallback = async () => await saveProject(true);
      autoSaveManagerRef.current.setInterval(settings.autoSave ? settings.autoSaveInterval : 0);
    }
    return () => { if (autoSaveManagerRef.current) autoSaveManagerRef.current.stop(); };
  }, [saveProject, settings.autoSave, settings.autoSaveInterval]);

  // --- Favorites & Settings ---
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('mb_favorites', JSON.stringify(next));
      return next;
    });
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      localStorage.setItem('mb_settings', JSON.stringify(next));
      return next;
    });
  };

  // --- Calculations ---
  useEffect(() => {
    if (pressureData.dates.length > 0 && pvtData.pressure.length > 0) {
        const diagData = calculateDiagnosticData(productionHistory, pressureData, pvtData, reservoirMetadata);
        setDiagnosticData(diagData);
        if (diagData.length > 1) {
            const vol = calculateLinearRegression(diagData, 'Eo', 'F');
            const gas = calculateLinearRegression(diagData, 'Eg_over_Eo', 'F_over_Eo');
            const wtr = calculateLinearRegression(diagData, 'Efw', 'F');
            setRegressionResults({ volumetric: vol, gascap: gas, water: wtr });
        }
    }
  }, [productionHistory, pressureData, pvtData, reservoirMetadata]);

  const runForecast = useCallback((schedule) => {
      // Mock forecast implementation for UI feedback
      setForecastData({ production: [], pressure: [] }); 
  }, []);

  const value = {
    currentProject, projectList, favorites, settings, isSaving, hasChanges, lastSavedTime,
    loadProjectAction, createProject, saveProject, deleteProject, toggleFavorite, updateSettings,
    reservoirMetadata, setReservoirMetadata,
    productionHistory, setProductionHistory, importProductionHistory: setProductionHistory,
    pressureData, setPressureData, importPressureData: setPressureData,
    pvtData, setPvtData, importPVTData: setPvtData,
    contactObservations, setContactObservations, importContactObservations: setContactObservations,
    diagnosticData, regressionResults, selectedDriveType, setSelectedDriveType,
    fittedModels, updateFittedModels: setFittedModels,
    scenarios, createScenario: (s) => setScenarios(prev => [...prev, { ...s, id: Date.now() }]),
    deleteScenario: (id) => setScenarios(prev => prev.filter(s => s.id !== id)),
    forecastData, runForecast, contactForecast,
    dataStatus: {
        production: productionHistory.dates.length > 0 ? 'Complete' : 'Missing',
        pressure: pressureData.dates.length > 0 ? 'Complete' : 'Missing',
        pvt: pvtData.pressure.length > 0 ? 'Complete' : 'Missing',
        contacts: contactObservations.dates.length > 0 ? 'Available' : 'None'
    }
  };

  return <MaterialBalanceContext.Provider value={value}>{children}</MaterialBalanceContext.Provider>;
};