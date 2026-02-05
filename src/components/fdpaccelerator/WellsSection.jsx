import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import WellRow from './WellRow';

const WellsSection = ({ formState, setFormState }) => {
  const { wells } = formState;

  const addWell = () => setFormState(prev => ({ ...prev, wells: [...prev.wells, { id: Date.now(), name: '', type: 'producer', count: 1, drilling_cost_mm_usd: 0, completion_cost_mm_usd: 0 }] }));
  
  const updateWell = (id, field, value) => {
    const newWells = wells.map(w => w.id === id ? { ...w, [field]: value } : w);
    setFormState(prev => ({ ...prev, wells: newWells }));
  };

  const removeWell = (id) => {
    const newWells = wells.filter(w => w.id !== id);
    setFormState(prev => ({ ...prev, wells: newWells }));
  };

  return (
    <CollapsibleSection title="Wells">
      <div className="space-y-2">
        {wells.map((well) => <WellRow key={well.id} item={well} updateFn={updateWell} removeFn={removeWell} />)}
        <Button type="button" variant="outline" size="sm" onClick={addWell} className="w-full border-lime-400 text-lime-400 hover:bg-lime-400/10"><PlusCircle className="w-4 h-4 mr-2" /> Add Well</Button>
      </div>
    </CollapsibleSection>
  );
};

export default WellsSection;