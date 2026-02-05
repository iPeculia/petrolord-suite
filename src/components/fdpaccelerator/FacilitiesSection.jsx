import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import FacilityRow from './FacilityRow';

const FacilitiesSection = ({ formState, setFormState }) => {
  const { facilities } = formState;

  const addFacility = () => setFormState(prev => ({ ...prev, facilities: [...prev.facilities, { id: Date.now(), name: '', capex_mm_usd: 0, opex_mm_usd_yr: 0, description: '' }] }));
  
  const updateFacility = (id, field, value) => {
    const newFacilities = facilities.map(f => f.id === id ? { ...f, [field]: value } : f);
    setFormState(prev => ({ ...prev, facilities: newFacilities }));
  };

  const removeFacility = (id) => {
    const newFacilities = facilities.filter(f => f.id !== id);
    setFormState(prev => ({ ...prev, facilities: newFacilities }));
  };

  return (
    <CollapsibleSection title="Facilities">
      <div className="space-y-2">
        {facilities.map((facility) => <FacilityRow key={facility.id} item={facility} updateFn={updateFacility} removeFn={removeFacility} />)}
        <Button type="button" variant="outline" size="sm" onClick={addFacility} className="w-full border-lime-400 text-lime-400 hover:bg-lime-400/10"><PlusCircle className="w-4 h-4 mr-2" /> Add Facility</Button>
      </div>
    </CollapsibleSection>
  );
};

export default FacilitiesSection;