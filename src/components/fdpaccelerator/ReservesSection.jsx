import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ReservesSection = ({ formState, setFormState }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <CollapsibleSection title="Reserves & Recovery">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="p50Reserves">P50 Reserves (MMbbl)</Label><Input id="p50Reserves" type="number" step="0.01" value={formState.p50Reserves} onChange={handleChange} /></div>
        <div><Label htmlFor="recoveryMethod">Recovery Method</Label>
          <select id="recoveryMethod" value={formState.recoveryMethod} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md p-2 text-black h-10">
            <option value="primary">Primary</option><option value="secondary">Secondary</option><option value="enhanced">Enhanced</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ReservesSection;