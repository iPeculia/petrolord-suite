import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { fitVolumetricModel, fitGasCapModel, fitWaterDriveModel } from '@/utils/materialBalance/MBModelFittingEngine';
import { useToast } from '@/components/ui/use-toast';
import { Activity, Save, BarChart2 } from 'lucide-react';

const MBModelFitting = () => {
  const { diagnosticData, updateFittedModels } = useMaterialBalance();
  const [modelType, setModelType] = useState('volumetric');
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const runFitting = () => {
    if (!diagnosticData || diagnosticData.length < 2) {
      toast({ title: "Error", description: "Not enough diagnostic data points to fit model.", variant: "destructive" });
      return;
    }

    // Add P_init if missing (grab from first point or context)
    const enrichedData = diagnosticData.map((d, i) => ({
        ...d,
        P_init: diagnosticData[0].P // Assume first point is init
    }));

    let res;
    try {
      switch (modelType) {
        case 'volumetric':
          res = fitVolumetricModel(enrichedData);
          break;
        case 'gascap':
          res = fitGasCapModel(enrichedData);
          break;
        case 'water':
          res = fitWaterDriveModel(enrichedData);
          break;
        default:
          res = fitVolumetricModel(enrichedData);
      }
      setResults(res);
      toast({ title: "Fitting Complete", description: `R²: ${res.R2.toFixed(4)}`, variant: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Fitting Failed", description: "Could not converge or calculate model.", variant: "destructive" });
    }
  };

  const saveModel = () => {
    if (results) {
      updateFittedModels(results.params);
      toast({ title: "Model Saved", description: "Parameters updated for forecasting." });
    }
  };

  // Helper to format large numbers
  const fmt = (num) => {
    if (num === undefined || num === null) return '-';
    if (Math.abs(num) > 1e6) return (num / 1e6).toFixed(2) + ' MM';
    if (Math.abs(num) > 1e3) return (num / 1e3).toFixed(2) + ' k';
    return num.toFixed(2);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50 flex flex-row justify-between items-center">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
          <Activity className="w-3 h-3 text-blue-400" /> Model Fitting
        </CardTitle>
        {results && (
            <Badge variant="outline" className={`${results.R2 > 0.9 ? 'text-green-400 border-green-900' : 'text-yellow-400 border-yellow-900'}`}>
                R² {results.R2.toFixed(3)}
            </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-3 space-y-4 overflow-y-auto">
        
        {/* Controls */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-semibold">MODEL TYPE</label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volumetric">Volumetric (Oil)</SelectItem>
              <SelectItem value="gascap">Gas Cap (Oil)</SelectItem>
              <SelectItem value="water">Water Drive (Pot Aquifer)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runFitting} className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-500">
            Run Regression
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-semibold">PARAMETERS</label>
                <Table>
                    <TableBody>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableCell className="py-1 text-[10px] text-slate-400">N (OOIP)</TableCell>
                            <TableCell className="py-1 text-[10px] font-mono text-right text-slate-200">{fmt(results.N)} STB</TableCell>
                        </TableRow>
                        {results.m !== undefined && (
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableCell className="py-1 text-[10px] text-slate-400">m (Ratio)</TableCell>
                                <TableCell className="py-1 text-[10px] font-mono text-right text-slate-200">{results.m.toFixed(3)}</TableCell>
                            </TableRow>
                        )}
                        {results.U !== undefined && (
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableCell className="py-1 text-[10px] text-slate-400">U (Aq. Const)</TableCell>
                                <TableCell className="py-1 text-[10px] font-mono text-right text-slate-200">{results.U.toFixed(2)}</TableCell>
                            </TableRow>
                        )}
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableCell className="py-1 text-[10px] text-slate-400">RMSE</TableCell>
                            <TableCell className="py-1 text-[10px] font-mono text-right text-slate-200">{results.RMSE.toFixed(4)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <Button onClick={saveModel} variant="secondary" className="w-full h-8 text-xs gap-2 border-slate-700">
                <Save className="w-3 h-3" /> Save Parameters
            </Button>
          </div>
        )}

        {!results && (
            <div className="text-center py-8 text-slate-600 text-xs">
                Select a model and run regression to estimate parameters.
            </div>
        )}

      </CardContent>
    </Card>
  );
};

export default MBModelFitting;