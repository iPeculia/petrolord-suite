import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegimeCard = ({ regime, onChange }) => {
  const handleInputChange = (field, value) => {
    onChange(regime.id, field, value);
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg space-y-4">
      <div>
        <Label className="text-lime-300">Regime Name</Label>
        <Input 
          value={regime.name} 
          onChange={(e) => handleInputChange('name', e.target.value)} 
          className="bg-white/10 border-white/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-lime-300">Royalty Rate (%)</Label>
          <Input 
            type="number" 
            value={regime.royalty} 
            onChange={(e) => handleInputChange('royalty', Number(e.target.value))} 
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label className="text-lime-300">Tax Rate (%)</Label>
          <Input 
            type="number" 
            value={regime.tax} 
            onChange={(e) => handleInputChange('tax', Number(e.target.value))} 
            className="bg-white/10 border-white/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-lime-300">Cost Recovery Limit (%)</Label>
          <Input 
            type="number" 
            value={regime.costRecoveryLimit} 
            onChange={(e) => handleInputChange('costRecoveryLimit', Number(e.target.value))} 
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label className="text-lime-300">Contractor Profit Split (%)</Label>
          <Input 
            type="number" 
            value={regime.profitSplit} 
            onChange={(e) => handleInputChange('profitSplit', Number(e.target.value))} 
            className="bg-white/10 border-white/20"
          />
        </div>
      </div>
    </div>
  );
};

export default RegimeCard;