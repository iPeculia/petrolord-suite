import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ppfg_phase2_state';

const DEFAULT_STATE = {
  activeStep: 1,
  steps: [
    { id: 1, name: 'Overburden Gradient', status: 'pending', results: null },
    { id: 2, name: 'Shale Discrimination', status: 'pending', results: null },
    { id: 3, name: 'NCT Analysis', status: 'pending', results: null },
    { id: 4, name: 'Pore Pressure', status: 'pending', results: null },
    { id: 5, name: 'Fracture Gradient', status: 'pending', results: null }
  ],
  nctParams: {
      method: 'eaton',
      a: 1.0,
      b: 0.0006
  },
  shalePoints: [],
  lastUpdated: Date.now()
};

export const usePhase2State = () => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic schema check
        if (parsed.steps && Array.isArray(parsed.steps)) {
          return parsed;
        }
      }
      return DEFAULT_STATE;
    } catch (e) {
      console.warn("Phase 2 State Load Failed", e);
      return DEFAULT_STATE;
    }
  });

  const isQuotaError = (e) => {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    );
  };

  // Smart persistence with fallback
  useEffect(() => {
    const saveState = () => {
      try {
        // 1. Clean up stale data: If state is older than 7 days, don't save (or reset)
        // But for now, just try saving current state.
        
        // Attempt full save
        const serialized = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serialized);
        
      } catch (error) {
        if (isQuotaError(error)) {
          console.warn("LocalStorage Quota Exceeded in Phase 2. Attempting optimization...");
          
          // 2. Optimization Strategy:
          // The most important data is User Inputs (nctParams, shalePoints).
          // Calculated results (arrays in steps[].results) are large but re-computable.
          // We strip the 'results' from steps to save space.
          
          const optimizedState = {
            ...state,
            steps: state.steps.map(step => ({
              ...step,
              // Keep status so UI knows it *was* done, but nullify results to force/allow re-calc or use context
              results: null 
            }))
          };
          
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(optimizedState));
            console.log("Phase 2 state saved with reduced payload (parameters only).");
          } catch (retryError) {
            console.error("Critical: Unable to save Phase 2 state even after optimization.", retryError);
            // 3. Emergency Cleanup: If even params fail, we might need to clear other old keys (not implemented here to be safe)
          }
        } else {
          console.error("LocalStorage Error:", error);
        }
      }
    };

    // Debounce save to reduce write frequency
    const timeoutId = setTimeout(saveState, 1000);
    return () => clearTimeout(timeoutId);

  }, [state]);

  const setStepComplete = useCallback((stepId, results) => {
      setState(prev => ({
          ...prev,
          steps: prev.steps.map(s => s.id === stepId ? { ...s, status: 'complete', results } : s),
          lastUpdated: Date.now()
      }));
  }, []);

  const updateNCTParams = useCallback((params) => {
      setState(prev => ({ ...prev, nctParams: { ...prev.nctParams, ...params } }));
  }, []);

  const setShalePoints = useCallback((points) => {
      setState(prev => ({ ...prev, shalePoints: points }));
  }, []);

  const setActiveStep = useCallback((stepId) => {
      setState(prev => ({ ...prev, activeStep: stepId }));
  }, []);

  const clearState = useCallback(() => {
      try {
          localStorage.removeItem(STORAGE_KEY);
          setState(DEFAULT_STATE);
          console.log("Phase 2 state cleared.");
      } catch(e) { 
          console.error("Failed to clear Phase 2 state", e); 
      }
  }, []);

  return {
      state,
      steps: state.steps,
      activeStep: state.activeStep,
      nctParams: state.nctParams,
      shalePoints: state.shalePoints,
      setStepComplete,
      updateNCTParams,
      setShalePoints,
      setActiveStep,
      clearState
  };
};