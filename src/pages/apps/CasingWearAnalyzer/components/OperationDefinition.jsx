import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2 } from 'lucide-react';

const OperationDefinition = () => {
  const { operationParams, setOperationParams, saveToUndo } = useCasingWearAnalyzer();

  // Safely access nested properties
  const safeParams = {
    type: operationParams?.type || 'Rotary Drilling',
    drillPipe: operationParams?.drillPipe || { size: 0, weight: 0 },
    hwdp: operationParams?.hwdp || { size: 0, weight: 0, count: 0 },
    drillCollars: operationParams?.drillCollars || { od: 0, weight: 0, count: 0 },
    toolJoints: operationParams?.toolJoints || { od: 0, length: 0 }
  };

  const handleOpChange = (field, value) => {
    saveToUndo();
    setOperationParams(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    saveToUndo();
    setOperationParams(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: parseFloat(value) || 0 }
    }));
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
          <Settings2 className="w-4 h-4 mr-2 text-amber-500" />
          BHA Configuration
        </CardTitle>
        <div className="w-48">
          <Select value={safeParams.type} onValueChange={(val) => handleOpChange('type', val)}>
            <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700">
              <SelectValue placeholder="Operation Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              {['Rotary Drilling', 'Sliding', 'Reaming', 'Backreaming', 'Circulating'].map(op => (
                <SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        
        {/* Drill Pipe */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drill Pipe</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Size (in)</Label>
              <Input 
                type="number" 
                value={safeParams.drillPipe.size} 
                onChange={(e) => handleNestedChange('drillPipe', 'size', e.target.value)}
                className="h-7 text-xs bg-slate-950 border-slate-800" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Weight (lb/ft)</Label>
              <Input 
                type="number" 
                value={safeParams.drillPipe.weight} 
                onChange={(e) => handleNestedChange('drillPipe', 'weight', e.target.value)}
                className="h-7 text-xs bg-slate-950 border-slate-800" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Tool Joint OD (in)</Label>
              <Input 
                type="number" 
                value={safeParams.toolJoints.od} 
                onChange={(e) => handleNestedChange('toolJoints', 'od', e.target.value)}
                className="h-7 text-xs bg-slate-950 border-slate-800 text-amber-400 font-medium" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">TJ Length (m)</Label>
              <Input 
                type="number" 
                value={safeParams.toolJoints.length} 
                onChange={(e) => handleNestedChange('toolJoints', 'length', e.target.value)}
                className="h-7 text-xs bg-slate-950 border-slate-800" 
              />
            </div>
          </div>
        </div>

        {/* HWDP & Collars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Heavy Weight DP</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Count (jts)</Label>
                <Input 
                  type="number" 
                  value={safeParams.hwdp.count} 
                  onChange={(e) => handleNestedChange('hwdp', 'count', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Size (in)</Label>
                <Input 
                  type="number" 
                  value={safeParams.hwdp.size} 
                  onChange={(e) => handleNestedChange('hwdp', 'size', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Weight (lb/ft)</Label>
                <Input 
                  type="number" 
                  value={safeParams.hwdp.weight} 
                  onChange={(e) => handleNestedChange('hwdp', 'weight', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drill Collars</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Count (jts)</Label>
                <Input 
                  type="number" 
                  value={safeParams.drillCollars.count} 
                  onChange={(e) => handleNestedChange('drillCollars', 'count', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">OD (in)</Label>
                <Input 
                  type="number" 
                  value={safeParams.drillCollars.od} 
                  onChange={(e) => handleNestedChange('drillCollars', 'od', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Weight (lb/ft)</Label>
                <Input 
                  type="number" 
                  value={safeParams.drillCollars.weight} 
                  onChange={(e) => handleNestedChange('drillCollars', 'weight', e.target.value)}
                  className="h-7 text-xs bg-slate-950 border-slate-800" 
                />
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default OperationDefinition;