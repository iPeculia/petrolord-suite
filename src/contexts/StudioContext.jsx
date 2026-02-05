import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { supabase as customSupabaseClient } from '@/lib/customSupabaseClient';
import { useAuth } from './SupabaseAuthContext';

// Exporting the context so it can be used/provided locally by standalone apps
export const StudioContext = createContext();

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (context === undefined) {
        // Return a safe default or throw, depending on strictness. 
        // For standalone migration, returning partial empty object allows checking existence.
        return {}; 
    }
    return context;
}

export const StudioProvider = ({ children, projectId }) => {
  const { user } = useAuth();
  const [appState, setAppState] = useState('INITIALIZING'); // INITIALIZING, HYDRATING, READY, ERROR
  const [startupError, setStartupError] = useState(null);
  
  const [activeProject, setActiveProject] = useState(null);
  const [allAssets, setAllAssets] = useState([]);
  const [allInterpretations, setAllInterpretations] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [activeSyntheticAsset, setActiveSyntheticAsset] = useState(null);
  const [visibleAssetIds, setVisibleAssetIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('3D');

  const [seismicState, setSeismicState] = useState({
    seismicData: null,
    viewParams: { pclip: 98, gain: 1.0, colorMap: 'grayscale', sliceType: 'inline', index: 0, vx: 1.0, hx: 1.0 },
    transform: { x: 0, y: 0, k: 1 },
    fileHandle: null,
    isLoading: false,
    error: null,
  });

  const setSeismicViewParams = useCallback((newParams) => {
    setSeismicState(prev => ({ ...prev, viewParams: { ...prev.viewParams, ...newParams } }));
  }, []);

  const setSeismicTransform = useCallback((newTransform) => {
    setSeismicState(prev => ({ ...prev, transform: newTransform }));
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || !user) {
        setAppState('INITIALIZING');
        return;
      }
      setAppState('HYDRATING');
      setStartupError(null);

      try {
        const [projectRes, assetsRes, interpretationsRes] = await Promise.all([
          customSupabaseClient.from('ss_projects').select('*').eq('id', projectId).single(),
          customSupabaseClient.from('ss_assets').select('*').eq('project_id', projectId).is('deleted_at', null),
          customSupabaseClient.from('ss_interpretations').select('*').eq('project_id', projectId).is('deleted_at', null)
        ]);

        if (projectRes.error) throw new Error(`Project fetch failed: ${projectRes.error.message}`);
        setActiveProject(projectRes.data);

        if (assetsRes.error) console.warn("Could not fetch assets:", assetsRes.error.message);
        setAllAssets(assetsRes.data || []);
        
        if (interpretationsRes.error) console.warn("Could not fetch interpretations:", interpretationsRes.error.message);
        setAllInterpretations(interpretationsRes.data || []);
        
        setVisibleAssetIds(new Set( (assetsRes.data || []).filter(a => a.type === 'well' || a.type === 'seis.volume').map(a => a.id) ));
        setAppState('READY');

      } catch (error) {
        console.error("Failed to fetch project data:", error);
        setStartupError(error.message);
        setAppState('ERROR');
      }
    };

    fetchProjectData();
  }, [projectId, user]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    
    const assetsChannel = customSupabaseClient.channel(`ss_assets_changes_${projectId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ss_assets', filter: `project_id=eq.${projectId}` }, payload => {
        if (payload.eventType === 'INSERT') setAllAssets(prev => [...prev, payload.new]);
        if (payload.eventType === 'UPDATE') setAllAssets(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        if (payload.eventType === 'DELETE') setAllAssets(prev => prev.filter(a => a.id !== payload.old.id));
      })
      .subscribe();
      
    const interpChannel = customSupabaseClient.channel(`ss_interpretations_changes_${projectId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ss_interpretations', filter: `project_id=eq.${projectId}` }, payload => {
        if (payload.eventType === 'INSERT') setAllInterpretations(prev => [...prev, payload.new]);
        if (payload.eventType === 'UPDATE') setAllInterpretations(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
        if (payload.eventType === 'DELETE') setAllInterpretations(prev => prev.filter(i => i.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      customSupabaseClient.removeChannel(assetsChannel);
      customSupabaseClient.removeChannel(interpChannel);
    };
  }, [projectId]);


  const getAssetById = useCallback((id) => allAssets.find(a => a.id === id), [allAssets]);

  const selectedAsset = useMemo(() => {
    if (activeSyntheticAsset) return activeSyntheticAsset;
    if (!selectedAssetId) return null;
    const asset = getAssetById(selectedAssetId);
    if (asset) return asset;
    return allInterpretations.find(i => i.id === selectedAssetId);
  }, [selectedAssetId, activeSyntheticAsset, getAssetById, allInterpretations]);

  const selectedWell = useMemo(() => {
    if (!selectedAsset) return null;
    if (selectedAsset.type === 'well') return selectedAsset;
    if (selectedAsset.parent_id) {
      return allAssets.find(a => a.id === selectedAsset.parent_id && a.type === 'well');
    }
    return null;
  }, [selectedAsset, allAssets]);
  
  const selectedLog = useMemo(() => {
      if(selectedAsset?.type === 'log.curve_set') return selectedAsset;
      return null;
  }, [selectedAsset]);
  
  const getAssetFile = useCallback(async (asset) => {
    if (!asset || !asset.uri) return null;
    
    if (seismicState.fileHandle && asset.uri === seismicState.fileHandle.uri) {
      return seismicState.fileHandle.file;
    }
    
    if (asset.meta?.local && asset.meta?.file instanceof File) {
        return asset.meta.file;
    }
    
    try {
        setSeismicState(prev => ({ ...prev, isLoading: true, error: null, fileHandle: null }));
        const bucket = asset.meta?.bucket || 'ss-assets';
        const { data, error } = await customSupabaseClient.storage.from(bucket).download(asset.uri);
        if (error) throw error;
        
        const file = new File([data], asset.name, { type: data.type });
        setSeismicState(prev => ({ ...prev, fileHandle: { uri: asset.uri, file } }));
        return file;
    } catch (error) {
        console.error("Error downloading asset file:", error);
        setSeismicState(prev => ({ ...prev, error: error.message, fileHandle: null }));
        return null;
    } finally {
        setSeismicState(prev => ({ ...prev, isLoading: false }));
    }
  }, [seismicState.fileHandle]);

  const toggleAssetVisibility = useCallback((asset) => {
    setVisibleAssetIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(asset.id)) {
        newSet.delete(asset.id);
        const children = allAssets.filter(a => a.parent_id === asset.id);
        children.forEach(c => newSet.delete(c.id));
      } else {
        newSet.add(asset.id);
        if(asset.parent_id) newSet.add(asset.parent_id);
      }
      return newSet;
    });
  }, [allAssets]);

  const selectAssetAndParentWell = useCallback((asset, options = {}) => {
      if(asset?.isSynthetic){
        setActiveSyntheticAsset(asset);
        setSelectedAssetId(null);
        // Automatically make synthetic assets visible when selected
        setVisibleAssetIds(prev => new Set(prev).add(asset.id));
      } else {
        if (activeSyntheticAsset) {
            // Hide previous synthetic asset when selecting a real one
            setVisibleAssetIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeSyntheticAsset.id);
                return newSet;
            });
        }
        setActiveSyntheticAsset(null);
        setSelectedAssetId(asset?.id || null);
      }
      if (options.activateTab) {
          setActiveTab(options.activateTab);
      }
  }, [activeSyntheticAsset]);
  
  const value = {
    appState, startupError,
    activeProject,
    allAssets, setAllAssets,
    allInterpretations: allInterpretations || [], setAllInterpretations,
    selectedAssetId, setSelectedAssetId,
    activeSyntheticAsset, setActiveSyntheticAsset,
    selectAssetAndParentWell,
    visibleAssetIds, setVisibleAssetIds, toggleAssetVisibility,
    activeTab, setActiveTab,
    getAssetById,
    getAssetFile,
    seismicState, setSeismicState, setSeismicViewParams, setSeismicTransform,
    // Provide derived state
    selectedAsset,
    selectedWell,
    selectedLog,
  };

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
};