import { supabase } from '@/lib/customSupabaseClient';

/**
 * Centralized service for complex Supabase operations, 
 * audit logging, and data consistency.
 */
export const SupabaseService = {
  
  // --- Audit Logging ---
  async logAction(action, details, actorId) {
    try {
      await supabase.from('audit_logs').insert({
        action,
        details,
        actor_id: actorId,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to audit log:', error);
    }
  },

  // --- Project Operations ---
  async getProjectDetails(projectId) {
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks (*),
        risks (*),
        pm_resources (*),
        pm_integrations (*)
      `)
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return project;
  },

  // --- Notification System ---
  async createNotification(userId, title, message, type = 'info', link = null) {
    const { error } = await supabase.from('user_notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      link
    });
    if (error) console.error('Notification failed:', error);
  },

  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  },

  async markNotificationRead(notificationId) {
    await supabase.from('user_notifications').update({ is_read: true }).eq('id', notificationId);
  }
};