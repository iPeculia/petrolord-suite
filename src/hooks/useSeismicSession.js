import { useReducer, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useJobMonitor } from './useJobMonitor';

const initialState = {
  asset: null,
  interpretations: [],
  currentPicks: [],
  isLoading: false,
  jobId: null,
  jobStatus: null,
  jobProgress: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ASSET':
      return { ...initialState, asset: action.payload };
    case 'SET_INTERPRETATIONS':
      return { ...state, interpretations: action.payload };
    case 'SET_CURRENT_PICKS':
      return { ...state, currentPicks: action.payload };
    case 'ADD_PICK':
      return { ...state, currentPicks: [...state.currentPicks, action.payload] };
    case 'START_JOB':
      return { ...state, isLoading: true, jobId: action.payload.jobId, jobStatus: 'Queued', jobProgress: 0 };
    case 'JOB_UPDATE':
      return { 
        ...state, 
        isLoading: action.payload.status === 'running' || action.payload.status === 'queued',
        jobStatus: action.payload.status,
        jobProgress: action.payload.progress || state.jobProgress,
      };
    case 'JOB_COMPLETE':
       const updatedPicks = action.payload.output?.points ? [...state.currentPicks, ...action.payload.output.points] : state.currentPicks;
       return { ...state, isLoading: false, jobId: null, jobStatus: 'completed', currentPicks: updatedPicks };
    case 'JOB_FAILED':
       return { ...state, isLoading: false, jobId: null, jobStatus: 'failed' };
    case 'CLEAR_JOB':
       return { ...state, isLoading: false, jobId: null, jobStatus: null, jobProgress: 0 };
    default:
      return state;
  }
};

export const useSeismicSession = (initialAsset, onSave) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, asset: initialAsset });
  
  const handleJobComplete = (job) => {
      if (job.status === 'completed') {
          dispatch({ type: 'JOB_COMPLETE', payload: job });
      } else if (job.status === 'failed') {
          dispatch({ type: 'JOB_FAILED' });
      }
  };

  useJobMonitor(state.jobId, handleJobComplete, (job) => {
      dispatch({ type: 'JOB_UPDATE', payload: job });
  });

  const actions = {
    setAsset: useCallback((asset) => dispatch({ type: 'SET_ASSET', payload: asset }), []),
    loadInterpretations: useCallback(async (assetId) => {
      if (!assetId) return;
      const { data, error } = await supabase
        .from('ss_interpretations')
        .select('*')
        .eq('project_id', state.asset.project_id) // simplified for now
        .is('deleted_at', null);
      if (!error) dispatch({ type: 'SET_INTERPRETATIONS', payload: data || [] });
    }, [state.asset]),

    selectInterpretation: useCallback((interpId) => {
      const interpretation = state.interpretations.find(i => i.id === interpId);
      if (interpretation) {
        const points = interpretation.data?.points || [];
        dispatch({ type: 'SET_CURRENT_PICKS', payload: points });
      }
    }, [state.interpretations]),

    addPick: useCallback((pick) => {
      dispatch({ type: 'ADD_PICK', payload: pick });
    }, []),

    autoPickAI: useCallback(async (seedPoint, kind) => {
      if (!state.asset) return;
      const functionName = kind === 'fault' ? 'ai-fault-detect' : 'ai-horizon-trace';
      try {
        const { data, error } = await supabase.functions.invoke(functionName, {
            body: {
                projectId: state.asset.project_id,
                volumeId: state.asset.id,
                section: { type: 'inline', index: 1500 }, // Mock section
                seed: seedPoint,
            },
        });
        if (error) throw error;
        
        dispatch({ type: 'START_JOB', payload: { jobId: data.jobId } });
        return data.jobId;

      } catch (error) {
        console.error(`AI auto-pick failed:`, error);
        dispatch({ type: 'JOB_FAILED' });
        throw error;
      }
    }, [state.asset]),

    savePicks: useCallback((name) => {
        if (onSave) {
            onSave({
                name: name,
                kind: 'horizon',
                points: state.currentPicks,
            });
        }
    }, [state.currentPicks, onSave]),

    newInterpretation: useCallback(() => {
        dispatch({ type: 'SET_CURRENT_PICKS', payload: [] });
    }, []),
  };

  return [state, actions];
};