import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const VariableCard = ({ variable, onChange, onDelete }) => {
  const handleInputChange = (field, value) => {
    onChange(variable.id, field, Number(value));
  };

  return (
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-white font-semibold">{variable.name}</Label>
        <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(variable.id)} className="text-red-400 hover:bg-red-500/20 hover:text-red-300 h-7 w-7">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs text-lime-300">P10</Label>
          <Input 
            type="number" 
            value={variable.p10} 
            onChange={(e) => handleInputChange('p10', e.target.value)} 
            className="bg-white/10 border-white/20 h-8"
          />
        </div>
        <div>
          <Label className="text-xs text-lime-300">P50</Label>
          <Input 
            type="number" 
            value={variable.p50} 
            onChange={(e) => handleInputChange('p50', e.target.value)} 
            className="bg-white/10 border-white/20 h-8"
          />
        </div>
        <div>
          <Label className="text-xs text-lime-300">P90</Label>
          <Input 
            type="number" 
            value={variable.p90} 
            onChange={(e) => handleInputChange('p90', e.target.value)} 
            className="bg-white/10 border-white/20 h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default VariableCard;