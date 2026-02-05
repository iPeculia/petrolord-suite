import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRightLeft, TrendingDown, Layers } from 'lucide-react';
import { earthModelIntegrationService } from '@/services/integrations/earthModelIntegrationService';
import { useToast } from '@/components/ui/use-toast';

const PPFGIntegration = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [ppfgData, setPpfgData] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await earthModelIntegrationService.syncPPFG();
      setPpfgData(result.data);
      toast({ title: "Sync Complete", description: "Pressure data updated successfully." });
    } catch (e) {
      toast({ title: "Sync Failed", description: "Could not connect to PPFG app.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-950">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded bg-red-500/10 text-red-400">
                <Activity className="w-6 h-6" />
              </div>
              <CardTitle className="text-white">PPFG Integration</CardTitle>
            </div>
            <CardDescription>Sync Pore Pressure & Fracture Gradients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSync} disabled={isSyncing} className="w-full bg-red-600 hover:bg-red-500">
              <ArrowRightLeft className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync with PPFG App'}
            </Button>
            
            {ppfgData && (
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Updated Wells</span>
                  <Badge variant="secondary">{ppfgData.wells_updated}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Pore Pressure Gradient</span>
                  <span className="text-sm font-mono text-emerald-400">{ppfgData.pore_pressure_gradient} psi/ft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Fracture Gradient</span>
                  <span className="text-sm font-mono text-blue-400">{ppfgData.fracture_gradient} psi/ft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Overburden Gradient</span>
                  <span className="text-sm font-mono text-orange-400">{ppfgData.overburden_gradient} psi/ft</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">Model Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center gap-3">
                <TrendingDown className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm text-slate-200">1D Models</div>
                  <div className="text-xs text-slate-500">Synced from 5 wells</div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center gap-3 opacity-50">
                <Layers className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm text-slate-200">3D Pressure Cube</div>
                  <div className="text-xs text-slate-500">Not generated</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="bg-slate-900 border-slate-800 flex-1">
          <CardHeader>
            <CardTitle className="text-white">Pressure Profile Visualization</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 h-[500px] bg-slate-950/50 m-4 rounded border border-slate-800 border-dashed flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Sync data to view Pressure vs Depth plot</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PPFGIntegration;