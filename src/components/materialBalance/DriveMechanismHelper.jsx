import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const DriveCard = ({ type, label, r2, paramLabel, paramValue, isActive }) => {
  let confidenceColor = "bg-red-500";
  if (r2 > 0.85) confidenceColor = "bg-yellow-500";
  if (r2 > 0.95) confidenceColor = "bg-green-500";

  return (
    <div className={`p-2 rounded border mb-2 ${isActive ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs font-semibold ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>{label}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-slate-700">R² {r2.toFixed(3)}</Badge>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Progress value={r2 * 100} className="h-1 bg-slate-800" indicatorClassName={confidenceColor} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Est. {paramLabel}:</span>
        <span className="font-mono text-slate-300">{paramValue}</span>
      </div>
    </div>
  );
};

const DriveMechanismHelper = () => {
  const { regressionResults, selectedDriveType, setSelectedDriveType } = useMaterialBalance();

  // Helper to format large numbers
  const fmt = (num) => {
    if (!num || isNaN(num)) return '-';
    if (Math.abs(num) > 1e6) return (num / 1e6).toFixed(2) + ' MM';
    if (Math.abs(num) > 1e3) return (num / 1e3).toFixed(2) + ' k';
    return num.toFixed(2);
  };

  const recs = regressionResults || {};

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Drive Mechanism ID</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-y-auto">
        
        <div className="mb-4">
          <label className="text-[10px] text-slate-500 mb-1 block">SELECTED MECHANISM</label>
          <Select value={selectedDriveType} onValueChange={setSelectedDriveType}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volumetric">Volumetric Depletion (Oil)</SelectItem>
              <SelectItem value="gascap">Gas Cap Drive</SelectItem>
              <SelectItem value="water">Water Drive</SelectItem>
              <SelectItem value="solution">Solution Gas</SelectItem>
              <SelectItem value="gas">Gas Reservoir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 mb-1 block">DIAGNOSTIC MATCHES</label>
          
          <DriveCard 
            type="volumetric" 
            label="Volumetric Oil" 
            r2={recs.volumetric?.r2 || 0} 
            paramLabel="N (OOIP)" 
            paramValue={fmt(recs.volumetric?.slope)} 
            isActive={selectedDriveType === 'volumetric'}
          />

          <DriveCard 
            type="gascap" 
            label="Gas Cap" 
            r2={recs.gascap?.r2 || 0} 
            paramLabel="m (Ratio)" 
            paramValue={recs.gascap?.slope?.toFixed(3)} 
            isActive={selectedDriveType === 'gascap'}
          />

          <DriveCard 
            type="water" 
            label="Water Drive" 
            r2={recs.water?.r2 || 0} 
            paramLabel="N (OOIP)" 
            paramValue={fmt(recs.water?.slope)} 
            isActive={selectedDriveType === 'water'}
          />

          <DriveCard 
            type="gas" 
            label="Dry Gas" 
            r2={recs.gas?.r2 || 0} 
            paramLabel="G (OGIP)" 
            paramValue={fmt(-1 / (recs.gas?.slope || 1))} 
            isActive={selectedDriveType === 'gas'}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default DriveMechanismHelper;