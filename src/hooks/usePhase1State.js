import { useState, useEffect, useCallback } from 'react';
import { idbKeyval } from '@/lib/idb'; // Using a simple IndexedDB wrapper

const METADATA_STORAGE_KEY = 'ppfg_phase1_metadata';
const DATA_STORAGE_KEY = 'ppfg_session_data';

const DEFAULT_STATE = {
  projectMeta: { wellName: 'New Well', area: 'N/A' },
  curveMapping: {
    DEPTH: 'DEPTH',
    GR: 'GR',
    DT: 'DT',
    RHOB: 'RHOB',
    RES_DEEP: 'RES_DEEP',
  },
  data: [], // Raw data will be held in component state, not localStorage
  fileName: null,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
};

// This hook will now manage large data in IndexedDB and metadata in localStorage.
export const usePhase1State = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  // Load metadata from localStorage on initial mount
  useEffect(() => {
    try {
      const storedMeta = localStorage.getItem(METADATA_STORAGE_KEY);
      if (storedMeta) {
        const parsedMeta = JSON.parse(storedMeta);
        setState(prev => ({ ...prev, ...parsedMeta }));
      }
    } catch (e) {
      console.warn("Phase 1 Metadata Load Failed", e);
    }
  }, []);
  
  // Persist metadata to localStorage whenever it changes
  useEffect(() => {
    try {
      const metadataToStore = {
        projectMeta: state.projectMeta,
        curveMapping: state.curveMapping,
        fileName: state.fileName,
      };
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metadataToStore));
    } catch (e) {
      console.error("Could not save Phase 1 metadata to localStorage", e);
    }
  }, [state.projectMeta, state.curveMapping, state.fileName]);


  const loadData = useCallback(async (data, fileName) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      // Store large data in IndexedDB
      await idbKeyval.set(DATA_STORAGE_KEY, data);
      
      // Update in-memory state
      setState(prev => ({
        ...prev,
        data,
        fileName,
        status: 'success',
        projectMeta: {
          ...prev.projectMeta,
          wellName: fileName.split('.')[0] || 'Loaded Well'
        }
      }));
    } catch (error) {
      console.error('Failed to save data to IndexedDB:', error);
      setState(prev => ({ ...prev, status: 'error', error: 'Failed to handle data.' }));
    }
  }, []);

  const updateCurveMapping = useCallback((mapping) => {
    setState(prev => ({ ...prev, curveMapping: { ...prev.curveMapping, ...mapping } }));
  }, []);

  const updateProjectMeta = useCallback((meta) => {
    setState(prev => ({ ...prev, projectMeta: { ...prev.projectMeta, ...meta } }));
  }, []);

  const clearState = useCallback(async () => {
    try {
        localStorage.removeItem(METADATA_STORAGE_KEY);
        await idbKeyval.del(DATA_STORAGE_KEY);
        setState(DEFAULT_STATE);
        console.log("Phase 1 state cleared (localStorage and IndexedDB).");
    } catch (e) {
        console.error("Failed to clear Phase 1 state", e);
    }
  }, []);

  return {
    state,
    loadData,
    updateCurveMapping,
    updateProjectMeta,
    clearState,
  };
};