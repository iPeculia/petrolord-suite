import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { earthModelIntegrationService } from '@/services/integrations/earthModelIntegrationService';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Link, 
  FileText, 
  Activity, 
  TrendingUp, 
  Share2, 
  Clock
} from 'lucide-react';

const IntegrationCard = ({ app, onSync }) => {
  const [status, setStatus] = useState('checking');
  const [lastSync, setLastSync] = useState('Never');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setStatus('checking');
    const result = await earthModelIntegrationService.checkConnection(app.id);
    setStatus(result.status === 'connected' ? 'connected' : 'error');
  };

  const handleSync = async () => {
    setStatus('syncing');
    await onSync(app.id);
    setLastSync(new Date().toLocaleTimeString());
    setStatus('connected');
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 ${app.color}`}>
              <app.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white">{app.name}</CardTitle>
              <CardDescription className="text-xs">{app.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {status === 'checking' && <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10">Checking...</Badge>}
            {status === 'syncing' && <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/10">Syncing...</Badge>}
            {status === 'connected' && <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Connected</Badge>}
            {status === 'error' && <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/10">Error</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Last synced: {lastSync}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-slate-700 hover:bg-slate-800 text-slate-300"
          onClick={handleSync}
          disabled={status === 'syncing' || status === 'checking'}
        >
          {status === 'syncing' ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
          Sync Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const IntegrationHub = () => {
  const apps = [
    { id: 'log_facies', name: 'Log Facies Analysis', description: 'Well logs & facies markers', icon: FileText, color: 'bg-blue-500' },
    { id: 'ppfg', name: 'PPFG Analyzer', description: 'Pore pressure gradients', icon: Activity, color: 'bg-red-500' },
    { id: 'npv', name: 'NPV & Scenarios', description: 'Economic volumes & scenarios', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'fdp', name: 'FDP Accelerator', description: 'Development plans & wells', icon: Share2, color: 'bg-purple-500' },
  ];

  const handleSync = async (appId) => {
    switch(appId) {
      case 'log_facies': await earthModelIntegrationService.syncLogFacies(); break;
      case 'ppfg': await earthModelIntegrationService.syncPPFG(); break;
      case 'npv': await earthModelIntegrationService.exportVolumesToNPV('current', { oil: 100, gas: 500 }); break;
      case 'fdp': await earthModelIntegrationService.syncDevelopmentPlan(); break;
      default: await new Promise(r => setTimeout(r, 1000));
    }
  };

  return (
    <div className="h-full p-6 overflow-auto bg-slate-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Integration Hub</h1>
        <p className="text-slate-400">Manage connections and data synchronization with other Petrolord apps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {apps.map(app => (
          <IntegrationCard key={app.id} app={app} onSync={handleSync} />
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800/50 last:border-0">
                  <div className="mt-1">
                    {i % 2 === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">
                      {i % 2 === 0 ? 'Successfully synced Facies Model from Log Facies App' : 'Exported Volumetrics to NPV Scenario Builder'}
                    </p>
                    <p className="text-xs text-slate-500">{i * 15} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationHub;