import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { IntegrationService } from '@/services/IntegrationService';
import { Loader2, CheckCircle2, XCircle, RefreshCw, PlugZap } from 'lucide-react';

const IntegrationHub = ({ project }) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState({}); // track loading state per service

  useEffect(() => {
    if (project?.id) {
      loadIntegrations();
    }
  }, [project?.id]);

  const loadIntegrations = async () => {
    try {
      const data = await IntegrationService.getProjectIntegrations(project.id);
      setIntegrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnect = async (serviceId) => {
    setLoading(prev => ({ ...prev, [serviceId]: 'connecting' }));
    try {
      await IntegrationService.connectIntegration(project.id, serviceId, { apiKey: '*****' });
      toast({ title: "Connected", description: `Successfully connected to ${serviceId}` });
      await loadIntegrations();
    } catch (error) {
      toast({ variant: "destructive", title: "Connection Failed", description: error.message });
    } finally {
      setLoading(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleSync = async (integration) => {
    setLoading(prev => ({ ...prev, [integration.service_name]: 'syncing' }));
    try {
      await IntegrationService.triggerSync(integration.id);
      toast({ title: "Synced", description: `${integration.service_name} data is up to date.` });
      await loadIntegrations();
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Failed", description: error.message });
    } finally {
      setLoading(prev => ({ ...prev, [integration.service_name]: false }));
    }
  };

  const handleDisconnect = async (integration) => {
    if(!window.confirm(`Disconnect ${integration.service_name}?`)) return;
    setLoading(prev => ({ ...prev, [integration.service_name]: 'disconnecting' }));
    try {
      await IntegrationService.disconnectIntegration(integration.id);
      toast({ title: "Disconnected" });
      await loadIntegrations();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, [integration.service_name]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <PlugZap className="w-5 h-5 text-yellow-400" /> External Systems
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IntegrationService.AVAILABLE_INTEGRATIONS.map(service => {
          const activeIntegration = integrations.find(i => i.service_name === service.id);
          const isProcessing = loading[service.id];

          return (
            <Card key={service.id} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base text-slate-200">{service.name}</CardTitle>
                  {activeIntegration ? (
                    <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900/60">Connected</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500 border-slate-700">Inactive</Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-slate-500">{service.category}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {activeIntegration && (
                  <div className="text-xs text-slate-400">
                    Last Sync: {activeIntegration.last_sync_at ? new Date(activeIntegration.last_sync_at).toLocaleString() : 'Never'}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                {activeIntegration ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleSync(activeIntegration)} disabled={!!isProcessing} className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                      {isProcessing === 'syncing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDisconnect(activeIntegration)} disabled={!!isProcessing} className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                      {isProcessing === 'disconnecting' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => handleConnect(service.id)} disabled={!!isProcessing} className="h-8 w-full bg-slate-800 hover:bg-slate-700 text-white">
                    {isProcessing === 'connecting' ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : 'Connect'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationHub;