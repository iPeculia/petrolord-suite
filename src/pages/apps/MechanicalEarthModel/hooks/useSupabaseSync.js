import { useCallback } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '@/components/ui/use-toast';

export const useSupabaseSync = (dispatch) => {
    const { toast } = useToast();

    const createNewProject = useCallback(async (projectName) => {
        const { data, error } = await supabaseService.createProject({ project_name: projectName });
        if (error) {
            toast({ variant: 'destructive', title: 'Error creating project', description: error.message });
            return;
        }
        dispatch({ type: 'SET_PROJECT', payload: { id: data.id, name: data.project_name } });
        toast({ title: 'Project Created', description: `Successfully created "${projectName}".` });
        return data;
    }, [dispatch, toast]);

    const syncInputData = useCallback(async (projectId, inputType, data) => {
        // This is a placeholder for syncing specific input types like logs, pressure, etc.
        // E.g., await supabaseService.updateWellLogs(projectId, data);
        toast({ title: 'Data Synced', description: `Input data for ${inputType} has been saved.` });
    }, [toast]);
    
    return { createNewProject, syncInputData };
};