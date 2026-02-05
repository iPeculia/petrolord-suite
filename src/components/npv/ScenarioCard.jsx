import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ScenarioCard = ({ scenario, onChange, baseValues, isExpert }) => {
  const handleInputChange = (field, value) => {
    onChange(scenario.id, field, value);
  };

  const getDelta = (val, baseVal) => {
      if (!baseVal) return null;
      const diff = ((val - baseVal) / baseVal) * 100;
      if (Math.abs(diff) < 0.1) return <Minus className="w-3 h-3 text-slate-400" />;
      if (diff > 0) return <span className="flex items-center text-green-400 text-xs"><TrendingUp className="w-3 h-3 mr-1"/>+{diff.toFixed(0)}%</span>;
      return <span className="flex items-center text-red-400 text-xs"><TrendingDown className="w-3 h-3 mr-1"/>{diff.toFixed(0)}%</span>;
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg space-y-4 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex justify-between items-center">
          <div>
            <Label className="text-lime-300">Scenario Name</Label>
            <Input 
            value={scenario.name} 
            onChange={(e) => handleInputChange('name', e.target.value)} 
            className="bg-white/10 border-white/20 h-8 w-40"
            />
          </div>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
              {scenario.id === 1 ? 'Base Case' : 'Alternative'}
          </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between">
            <Label className="text-xs text-slate-400">CAPEX ($MM)</Label>
            {scenario.id !== 1 && getDelta(scenario.capex, baseValues.capex)}
          </div>
          <Input 
            type="number" 
            value={scenario.capex} 
            onChange={(e) => handleInputChange('capex', Number(e.target.value))} 
            className="bg-white/10 border-white/20 h-8"
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label className="text-xs text-slate-400">Oil Price ($/bbl)</Label>
            {scenario.id !== 1 && getDelta(scenario.oilPrice, baseValues.oilPrice)}
          </div>
          <Input 
            type="number" 
            value={scenario.oilPrice} 
            onChange={(e) => handleInputChange('oilPrice', Number(e.target.value))} 
            className="bg-white/10 border-white/20 h-8"
          />
        </div>
      </div>

      {isExpert && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
                <Label className="text-xs text-slate-400">OPEX ($/bbl)</Label>
                <Input 
                    type="number" 
                    value={scenario.opexPerBbl} 
                    onChange={(e) => handleInputChange('opexPerBbl', Number(e.target.value))} 
                    className="bg-white/10 border-white/20 h-8"
                />
            </div>
            <div>
                <Label className="text-xs text-slate-400">Start Year</Label>
                <Input 
                    type="number" 
                    value={scenario.startYear || new Date().getFullYear()} 
                    onChange={(e) => handleInputChange('startYear', Number(e.target.value))} 
                    className="bg-white/10 border-white/20 h-8"
                />
            </div>
          </div>
      )}
    </div>
  );
};

export default ScenarioCard;