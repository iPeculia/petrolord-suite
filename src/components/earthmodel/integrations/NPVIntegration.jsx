import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Upload, PieChart, DollarSign } from 'lucide-react';
import { earthModelIntegrationService } from '@/services/integrations/earthModelIntegrationService';
import { useToast } from '@/components/ui/use-toast';

const NPVIntegration = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  
  // Mock current volumes
  const volumes = {
    oil_stoip: 125.5, // MMbbl
    gas_giip: 450.2, // Bcf
    recoverable_oil: 45.2, // MMbbl
    recoverable_gas: 320.1 // Bcf
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await earthModelIntegrationService.exportVolumesToNPV('current_realization', volumes);
      setExportResult(result);
      toast({ title: "Export Successful", description: "Volumes pushed to NPV Scenario Builder." });
    } catch (e) {
      toast({ title: "Export Failed", description: "Could not connect to NPV app.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-950 items-start">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-green-500/10 text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-white">NPV & Economics</CardTitle>
              <CardDescription>Export EarthModel volumes to Economic Analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">STOIIP (P50)</div>
              <div className="text-2xl font-bold text-white">{volumes.oil_stoip} <span className="text-xs font-normal text-slate-500">MMbbl</span></div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">GIIP (P50)</div>
              <div className="text-2xl font-bold text-white">{volumes.gas_giip} <span className="text-xs font-normal text-slate-500">Bcf</span></div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Rec. Oil</div>
              <div className="text-2xl font-bold text-emerald-400">{volumes.recoverable_oil} <span className="text-xs font-normal text-slate-500">MMbbl</span></div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Rec. Gas</div>
              <div className="text-2xl font-bold text-emerald-400">{volumes.recoverable_gas} <span className="text-xs font-normal text-slate-500">Bcf</span></div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button onClick={handleExport} disabled={isExporting} className="w-full bg-green-600 hover:bg-green-500">
              <Upload className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Exporting...' : 'Push to Scenario Builder'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader>
          <CardTitle className="text-white">Economic Impact Preview</CardTitle>
          <CardDescription>Projected economics based on current volumes</CardDescription>
        </CardHeader>
        <CardContent>
          {exportResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-center">
                  <div className="text-sm text-green-400 mb-2">Volume Update Successful</div>
                  <Badge variant="outline" className="text-green-400 border-green-500/30">Scenario ID: {exportResult.scenario_link}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Quick Look Economics</h4>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-200">NPV Change</span>
                  </div>
                  <span className="font-bold text-green-400">{exportResult.economic_impact.npv_change}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-3">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-200">IRR</span>
                  </div>
                  <span className="font-bold text-blue-400">{exportResult.economic_impact.irr}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Push volumes to calculate economic impact</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NPVIntegration;