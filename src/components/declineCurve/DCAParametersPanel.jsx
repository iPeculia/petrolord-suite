import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fitArpsModel } from '@/utils/declineCurve/dcaEngine';

const DCAParametersPanel = () => {
  const { 
    selectedStream, 
    setSelectedStream, 
    forecastSettings, 
    updateForecastSettings,
    currentData,
    updateModelParameters
  } = useDeclineCurve();

  const handleAutoFit = () => {
    if (currentData.length > 0) {
      const result = fitArpsModel(currentData, 'Exponential', null);
      if (result) {
        updateModelParameters(result);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Production Stream</Label>
        <Select value={selectedStream} onValueChange={setSelectedStream}>
          <SelectTrigger className="bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
            <SelectItem value="oil">Oil</SelectItem>
            <SelectItem value="gas">Gas</SelectItem>
            <SelectItem value="water">Water</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Forecast Duration (Days)</Label>
        <Input 
          type="number" 
          value={forecastSettings.days} 
          onChange={(e) => updateForecastSettings({ days: parseInt(e.target.value) })}
          className="bg-slate-800 border-slate-700"
        />
      </div>

      <div className="space-y-2">
        <Label>Economic Limit (Rate)</Label>
        <Input 
          type="number" 
          value={forecastSettings.economicLimit} 
          onChange={(e) => updateForecastSettings({ economicLimit: parseFloat(e.target.value) })}
          className="bg-slate-800 border-slate-700"
        />
      </div>

      <div className="pt-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-500"
          onClick={handleAutoFit}
          disabled={currentData.length === 0}
        >
          Auto-Fit Curve
        </Button>
      </div>
    </div>
  );
};

export default DCAParametersPanel;