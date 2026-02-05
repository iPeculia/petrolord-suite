import { useCallback, useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

export const useDataSync = (state, dispatch) => {
    const { toast } = useToast();
    const [syncStatus, setSyncStatus] = useState('idle');
    const debouncedState = useDebounce(state, 1500); // Debounce state changes

    const saveWellLogData = useCallback(async ({ wellName, logData, curveMap }) => {
        if (!debouncedState.projectId) return;
        setSyncStatus('saving');
        const { error } = await supabaseService.saveWellLogData(debouncedState.projectId, { wellName, logData, curveMap });
        if (error) {
            toast({ variant: 'destructive', title: 'Sync Error', description: `Failed to save well data: ${error.message}` });
            setSyncStatus('idle'); // Or 'error'
        } else {
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 2000);
        }
    }, [debouncedState.projectId, toast]);
    
    // Auto-save logic
    useEffect(() => {
        // This effect will run when the debouncedState changes
        if (debouncedState.inputs.logs && debouncedState.projectId) {
            saveWellLogData({
                wellName: 'DefaultWell', // This would come from state in a multi-well setup
                logData: debouncedState.inputs.logs,
                curveMap: debouncedState.inputs.curveMap
            });
        }
    }, [debouncedState]); // Only depends on the debounced state

    const loadWellLogData = useCallback(async (projectId, wellName) => {
        const { data, error } = await supabaseService.loadWellLogData(projectId, wellName);
        if (data) {
            dispatch({ type: 'SET_INPUT_DATA', payload: { logs: data.log_data } });
            dispatch({ type: 'SET_CURVE_MAP', payload: data.curve_map });
            toast({ title: 'Data Loaded', description: `Well log data for ${wellName} loaded successfully.`});
        }
        if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
            toast({ variant: 'destructive', title: 'Load Error', description: error.message });
        }
    }, [dispatch, toast]);

    return { saveWellLogData, loadWellLogData, syncStatus };
};