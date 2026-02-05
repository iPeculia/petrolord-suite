import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DepthUnitSelector = ({ unit, onUnitChange, reference, onReferenceChange }) => {
  return (
    <div className="space-y-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-400">Depth Unit</Label>
        <RadioGroup 
          value={unit} 
          onValueChange={onUnitChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="M" id="r-meters" className="border-slate-500 text-blue-500" />
            <Label htmlFor="r-meters" className="text-slate-300 text-xs cursor-pointer">Meters (MD)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FT" id="r-feet" className="border-slate-500 text-blue-500" />
            <Label htmlFor="r-feet" className="text-slate-300 text-xs cursor-pointer">Feet (MD)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-400">Vertical Reference</Label>
        <Select value={reference} onValueChange={onReferenceChange}>
          <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="KB">Kelly Bushing (KB)</SelectItem>
            <SelectItem value="MSL">Mean Sea Level (MSL)</SelectItem>
            <SelectItem value="GL">Ground Level (GL)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DepthUnitSelector;