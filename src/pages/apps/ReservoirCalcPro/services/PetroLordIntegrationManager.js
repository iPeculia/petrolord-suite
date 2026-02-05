import { supabase } from '@/lib/customSupabaseClient';

/**
 * PetroLordIntegrationManager
 * Handles low-level communication with the shared_data_registry table.
 */
export class PetroLordIntegrationManager {
    static APP_ID = 'reservoircalc-pro';

    /**
     * Fetches shared data items filtered by criteria.
     */
    static async fetchSharedData({ sourceApp, category, projectId } = {}) {
        let query = supabase
            .from('shared_data_registry')
            .select('*')
            .order('created_at', { ascending: false });

        if (sourceApp) query = query.eq('source_app_id', sourceApp);
        if (category) query = query.eq('data_category', category);
        if (projectId) query = query.eq('project_id', projectId);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Publishes data to the shared registry.
     */
    static async publishData({
        projectId,
        dataName,
        dataCategory,
        description,
        payload,
        version = 1,
        isPublic = false,
        tags = []
    }) {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("User not authenticated");

        const record = {
            user_id: user.id,
            project_id: projectId, // Optional link to generic project table
            source_app_id: this.APP_ID,
            source_record_id: crypto.randomUUID(), // Unique ID for this specific data instance
            data_name: dataName,
            data_category: dataCategory,
            description: description,
            payload: payload,
            version: version,
            is_public_to_org: isPublic,
            tags: tags,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('shared_data_registry')
            .insert([record])
            .select();

        if (error) throw error;
        return data[0];
    }

    /**
     * Subscribes to changes in shared data for real-time updates.
     */
    static subscribeToUpdates(callback) {
        return supabase
            .channel('shared-data-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shared_data_registry' }, payload => {
                callback(payload.new);
            })
            .subscribe();
    }
}