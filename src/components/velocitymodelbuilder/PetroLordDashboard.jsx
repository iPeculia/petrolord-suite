import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { petroLordService } from '@/services/PetroLordIntegration';

const PetroLordDashboard = () => {
  const [status, setStatus] = useState({ connected: false, queueLength: 0, syncStatus: 'idle' });

  useEffect(() => {
    // Initial status
    setStatus(petroLordService.getIntegrationStatus());

    // Subscribe to updates
    const unsubscribe = petroLordService.subscribe(() => {
        setStatus(petroLordService.getIntegrationStatus());
    });
    return unsubscribe;
  }, []);

  const modules = [
    { name: 'Velocity Model Builder', status: 'active', version: '10.0.1' },
    { name: 'PPFG Analyzer', status: 'active', version: '2.1.0' },
    { name: 'Geomechanics 1D', status: 'active', version: '1.4.2' },
    { name: 'Prospect Risking', status: 'beta', version: '0.9.0' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm">Integration Health</CardTitle></CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${status.connected ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    <Activity className={`w-6 h-6 ${status.connected ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
                <div>
                    <div className="text-lg font-bold text-white">{status.connected ? 'System Operational' : 'Disconnected'}</div>
                    <div className="text-xs text-slate-400">{status.syncStatus === 'syncing' ? 'Syncing data...' : 'All systems nominal'}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2 rounded flex justify-between">
                    <span className="text-slate-400">Pending Syncs</span>
                    <span className="font-mono text-white">{status.queueLength}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded flex justify-between">
                    <span className="text-slate-400">Latency</span>
                    <span className="font-mono text-emerald-400">45ms</span>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm">Module Status</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-2">
                {modules.map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800/50">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-medium text-slate-300">{m.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-5">{m.version}</Badge>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetroLordDashboard;