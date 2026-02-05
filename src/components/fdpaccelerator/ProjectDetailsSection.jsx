import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProjectDetailsSection = ({ formState, setFormState }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <CollapsibleSection title="Project Details" defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="projectName">Project Name</Label><Input id="projectName" value={formState.projectName} onChange={handleChange} required /></div>
        <div><Label htmlFor="loc">Location</Label><Input id="loc" value={formState.loc} onChange={handleChange} /></div>
        <div><Label htmlFor="partners">Partners (comma-separated)</Label><Input id="partners" value={formState.partners} onChange={handleChange} /></div>
        <div><Label htmlFor="startDate">Start Date</Label><Input id="startDate" type="date" value={formState.startDate} onChange={handleChange} /></div>
        <div><Label htmlFor="endDate">End Date</Label><Input id="endDate" type="date" value={formState.endDate} onChange={handleChange} /></div>
      </div>
    </CollapsibleSection>
  );
};

export default ProjectDetailsSection;