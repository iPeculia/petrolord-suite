import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AFECreationWizard = ({ open, onOpenChange, projects, onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    project_id: '',
    afe_number: '',
    afe_name: '',
    budget: 0,
    currency: 'USD',
    class: 'Budget',
    operator_share: 100,
    partner_share: 0,
    status: 'Draft'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from('afes').insert([{
        ...formData,
        user_id: (await supabase.auth.getUser()).data.user.id
    }]);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'AFE Created.' });
      onSuccess();
      onOpenChange(false);
      setStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New AFE - Step {step} of 3</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <Label>Project Link</Label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
                  value={formData.project_id}
                  onChange={e => handleChange('project_id', e.target.value)}
                >
                  <option value="">Select Project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>AFE Number</Label>
                  <Input value={formData.afe_number} onChange={e => handleChange('afe_number', e.target.value)} className="bg-slate-800 border-slate-700" placeholder="AFE-2024-001" />
                </div>
                <div>
                  <Label>AFE Name</Label>
                  <Input value={formData.afe_name} onChange={e => handleChange('afe_name', e.target.value)} className="bg-slate-800 border-slate-700" placeholder="Drilling Campaign..." />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={val => handleChange('currency', val)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Budget Amount</Label>
                  <Input type="number" value={formData.budget} onChange={e => handleChange('budget', parseFloat(e.target.value))} className="bg-slate-800 border-slate-700" />
                </div>
              </div>
              <div>
                <Label>AFE Class</Label>
                <Select value={formData.class} onValueChange={val => handleChange('class', val)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Screening">Screening (+/- 50%)</SelectItem>
                    <SelectItem value="Budget">Budget (+/- 30%)</SelectItem>
                    <SelectItem value="Control">Control (+/- 10%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Operator Share (%)</Label>
                  <Input type="number" value={formData.operator_share} onChange={e => handleChange('operator_share', parseFloat(e.target.value))} className="bg-slate-800 border-slate-700" />
                </div>
                <div>
                  <Label>Partner Share (%)</Label>
                  <Input type="number" value={100 - formData.operator_share} disabled className="bg-slate-800 border-slate-700 opacity-50" />
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded text-sm text-slate-300">
                <p><strong>Summary:</strong></p>
                <p>AFE: {formData.afe_number} - {formData.afe_name}</p>
                <p>Budget: {formData.budget} {formData.currency}</p>
                <p>Share: {formData.operator_share}% Ops / {100 - formData.operator_share}% Partner</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-blue-600">Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600">Create AFE</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AFECreationWizard;