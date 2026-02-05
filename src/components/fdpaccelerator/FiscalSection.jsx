import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FiscalSection = ({ formState, setFormState }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <CollapsibleSection title="Fiscal & Economic Terms">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div><Label htmlFor="royalty">Royalty %</Label><Input id="royalty" type="number" step="0.01" value={formState.royalty} onChange={handleChange} /></div>
        <div><Label htmlFor="tax">Tax %</Label><Input id="tax" type="number" step="0.01" value={formState.tax} onChange={handleChange} /></div>
        <div><Label htmlFor="costRecovery">Cost Recovery %</Label><Input id="costRecovery" type="number" step="0.01" value={formState.costRecovery} onChange={handleChange} /></div>
        <div><Label htmlFor="discountRate">Discount Rate %</Label><Input id="discountRate" type="number" step="0.01" value={formState.discountRate} onChange={handleChange} /></div>
      </div>
    </CollapsibleSection>
  );
};

export default FiscalSection;