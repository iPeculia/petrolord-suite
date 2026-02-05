import { useCallback, useState } from 'react';
import { edgeFunctionService } from '../services/edgeFunctionService';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '@/components/ui/use-toast';

export const useCalculations = (dispatch) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const runCalculation = useCallback(async (projectId, functionName, payload) => {
        setLoading(true);
        dispatch({ type: 'SET_JOB_STATUS', payload: 'running' });

        const { data: job, error: jobError } = await supabaseService.createJob({
            project_id: projectId,
            function_name: functionName,
            input_payload: payload,
        });

        if (jobError) {
            toast({ variant: 'destructive', title: 'Job Creation Failed', description: jobError.message });
            dispatch({ type: 'SET_JOB_STATUS', payload: 'failed' });
            setLoading(false);
            return;
        }

        dispatch({ type: 'SET_JOB_ID', payload: job.id });

        const { data, error } = await edgeFunctionService[functionName]({ ...payload, jobId: job.id });

        if (error) {
            toast({ variant: 'destructive', title: 'Calculation Failed', description: error.message });
            await supabaseService.updateJobStatus(job.id, 'failed', error.message);
            dispatch({ type: 'SET_JOB_STATUS', payload: 'failed' });
        } else {
            toast({ title: 'Calculation Complete', description: `Results for ${functionName} are ready.` });
            await supabaseService.saveResults(projectId, job.id, data);
            await supabaseService.updateJobStatus(job.id, 'completed');
            dispatch({ type: 'SET_RESULTS', payload: data });
            dispatch({ type: 'SET_JOB_STATUS', payload: 'completed' });
        }

        setLoading(false);
    }, [dispatch, toast]);

    return { runCalculation, loading };
};