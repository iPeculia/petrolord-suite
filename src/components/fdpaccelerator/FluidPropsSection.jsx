import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FluidPropsSection = ({ formState, setFormState }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <CollapsibleSection title="Fluid Properties">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><Label htmlFor="apiGravity">API Gravity</Label><Input id="apiGravity" type="number" step="0.1" value={formState.apiGravity} onChange={handleChange} /></div>
        <div><Label htmlFor="gor">Gas-Oil Ratio (GOR)</Label><Input id="gor" type="number" step="1" value={formState.gor} onChange={handleChange} /></div>
        <div><Label htmlFor="viscosity">Viscosity (cP)</Label><Input id="viscosity" type="number" step="0.1" value={formState.viscosity} onChange={handleChange} /></div>
      </div>
    </CollapsibleSection>
  );
};

export default FluidPropsSection;