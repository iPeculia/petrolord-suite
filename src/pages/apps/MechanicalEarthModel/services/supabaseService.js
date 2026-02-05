import { supabase } from '@/lib/customSupabaseClient';

export const supabaseService = {
    // Project Management
    createProject: async (projectData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('mem_projects').insert({ ...projectData, user_id: user.id }).select().single();
        return { data, error };
    },
    getProject: async (projectId) => {
        const { data, error } = await supabase.from('mem_projects').select('*').eq('id', projectId).single();
        return { data, error };
    },
    
    // Data Management
    saveWellLogData: async (projectId, { wellName, logData, curveMap }) => {
        const { data, error } = await supabase.from('mem_well_logs').upsert(
            { project_id: projectId, well_name: wellName, log_data: logData, curve_map: curveMap },
            { onConflict: 'project_id, well_name' }
        ).select().single();
        return { data, error };
    },
    
    loadWellLogData: async (projectId, wellName) => {
        const { data, error } = await supabase.from('mem_well_logs')
            .select('log_data, curve_map')
            .eq('project_id', projectId)
            .eq('well_name', wellName)
            .single();
        return { data, error };
    },

    // Job Management
    createJob: async (jobData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('mem_edge_function_jobs').insert({ ...jobData, user_id: user.id }).select().single();
        return { data, error };
    },
    updateJobStatus: async (jobId, status, errorMessage = null) => {
        const { data, error } = await supabase.from('mem_edge_function_jobs').update({ status, error_message: errorMessage }).eq('id', jobId).select().single();
        return { data, error };
    },

    // Results Management
    saveResults: async (projectId, jobId, resultsData) => {
        const { data, error } = await supabase.from('mem_calculations').insert({ project_id: projectId, job_id: jobId, results: resultsData, status: 'completed' }).select().single();
        return { data, error };
    }
};