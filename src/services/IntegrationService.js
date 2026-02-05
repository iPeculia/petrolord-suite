import { supabase } from '@/lib/customSupabaseClient';

export const IntegrationService = {
  
  AVAILABLE_INTEGRATIONS: [
    { id: 'jira', name: 'Jira Software', category: 'Project Management', icon: 'Layout' },
    { id: 'sap', name: 'SAP ERP', category: 'Finance', icon: 'DollarSign' },
    { id: 'slack', name: 'Slack', category: 'Communication', icon: 'MessageSquare' },
    { id: 'sharepoint', name: 'SharePoint', category: 'Documents', icon: 'FileText' },
    { id: 'salesforce', name: 'Salesforce', category: 'CRM', icon: 'Users' }
  ],

  async getProjectIntegrations(projectId) {
    const { data } = await supabase.from('pm_integrations').select('*').eq('project_id', projectId);
    return data || [];
  },

  async connectIntegration(projectId, serviceName, config) {
    // In a real app, this would perform OAuth handshake or validate API keys via Edge Function
    // Simulating connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { data, error } = await supabase.from('pm_integrations').upsert({
      project_id: projectId,
      service_name: serviceName,
      config: { ...config, connected_at: new Date().toISOString() },
      status: 'connected',
      last_sync_at: new Date().toISOString()
    }).select().single();

    if (error) throw error;
    return data;
  },

  async disconnectIntegration(integrationId) {
    const { error } = await supabase.from('pm_integrations').delete().eq('id', integrationId);
    if (error) throw error;
  },

  async triggerSync(integrationId) {
    // Call generic integration edge function if exists, else simulate
    // const { data, error } = await supabase.functions.invoke('integration-sync', { body: { integrationId } });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { error } = await supabase.from('pm_integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', integrationId);
      
    if(error) throw error;
    return { success: true, message: 'Synced successfully' };
  }
};