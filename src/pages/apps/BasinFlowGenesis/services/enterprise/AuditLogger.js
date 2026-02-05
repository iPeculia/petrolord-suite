import { supabase } from '@/lib/customSupabaseClient';

export class AuditLogger {
    static async log(action, details, userId, projectId, wellId = null) {
        try {
            if (!userId || !projectId) {
                console.warn("AuditLogger: Missing userId or projectId", { action, userId, projectId });
                return;
            }

            const payload = {
                project_id: projectId,
                user_id: userId,
                well_id: wellId,
                action: action,
                details: typeof details === 'string' ? { message: details } : details,
                // created_at is handled by DB default
            };

            const { error } = await supabase
                .from('bf_activity_log')
                .insert([payload]);

            if (error) {
                console.error("AuditLogger Error:", error);
            }
        } catch (e) {
            console.error("AuditLogger Exception:", e);
        }
    }

    static async fetchLogs(projectId, limit = 50) {
        const { data, error } = await supabase
            .from('bf_activity_log')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return data;
    }
}