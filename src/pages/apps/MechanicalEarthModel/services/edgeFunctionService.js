import { supabase } from '@/lib/customSupabaseClient';

const invokeEdgeFunction = async (functionName, body) => {
    const { data, error } = await supabase.functions.invoke(functionName, {
        body: JSON.stringify(body),
    });
    if (error) {
        console.error(`Error invoking ${functionName}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const edgeFunctionService = {
    calculateProperties: (payload) => invokeEdgeFunction('calculate-properties', payload),
    calculateStresses: (payload) => invokeEdgeFunction('calculate-stresses', payload),
    calculateMudWindow: (payload) => invokeEdgeFunction('calculate-mud-window', payload),
    calculateCalibration: (payload) => invokeEdgeFunction('calculate-calibration', payload),
};