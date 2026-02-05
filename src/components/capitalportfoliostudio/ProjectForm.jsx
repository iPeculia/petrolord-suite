import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: project?.name || '',
    capex: project?.capex || '',
    npv_p10: project?.npv_p10 || '',
    npv_p50: project?.npv_p50 || '',
    npv_p90: project?.npv_p90 || '',
    risk_score: project?.risk_score || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const projectData = {
      user_id: user.id,
      name: formData.name,
      capex: parseFloat(formData.capex),
      npv_p10: parseFloat(formData.npv_p10),
      npv_p50: parseFloat(formData.npv_p50),
      npv_p90: parseFloat(formData.npv_p90),
      risk_score: parseFloat(formData.risk_score),
    };

    if (Object.values(projectData).some(v => v === null || v === '' || (typeof v === 'number' && isNaN(v)) && typeof v !== 'string')) {
      toast({ variant: 'destructive', title: 'Please fill all fields correctly.' });
      return;
    }

    let error;
    if (project?.id) {
      const { error: updateError } = await supabase.from('portfolio_projects').update(projectData).eq('id', project.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('portfolio_projects').insert(projectData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to save project', description: error.message });
    } else {
      toast({ title: 'Success!', description: `Project ${project?.id ? 'updated' : 'created'}.` });
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label htmlFor="name">Project Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label htmlFor="capex">CAPEX ($MM)</Label><Input id="capex" name="capex" type="number" value={formData.capex} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
        <div><Label htmlFor="risk_score">Risk Score (1-10)</Label><Input id="risk_score" name="risk_score" type="number" min="1" max="10" value={formData.risk_score} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label htmlFor="npv_p10">NPV P10 ($MM)</Label><Input id="npv_p10" name="npv_p10" type="number" value={formData.npv_p10} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
        <div><Label htmlFor="npv_p50">NPV P50 ($MM)</Label><Input id="npv_p50" name="npv_p50" type="number" value={formData.npv_p50} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
        <div><Label htmlFor="npv_p90">NPV P90 ($MM)</Label><Input id="npv_p90" name="npv_p90" type="number" value={formData.npv_p90} onChange={handleChange} className="bg-white/5 border-white/20" required /></div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{project?.id ? 'Update' : 'Create'} Project</Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;