import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Target, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TargetDialog = ({ isOpen, onClose, onSave, target, ppfgProjects }) => {
  const [formData, setFormData] = useState({
    name: '',
    target_type: 'Point',
    tvd_m: '',
    tvdss: '',
    md_estimate: '',
    x: '',
    y: '',
    tolerance_radius: '',
    priority: 'Medium',
    status: 'Active',
    notes: '',
    reservoir: '',
    ppfg_project_id: 'none',
    dip: '',
    azimuth: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (target) {
      setFormData({
        name: target.name || '',
        target_type: target.target_type || 'Point',
        tvd_m: target.tvd_m || '',
        tvdss: target.target_data?.tvdss || '',
        md_estimate: target.target_data?.md_estimate || '',
        x: target.x || '',
        y: target.y || '',
        tolerance_radius: target.target_data?.tolerance_radius || '',
        priority: target.priority === 1 ? 'High' : target.priority === 2 ? 'Medium' : 'Low',
        status: target.target_data?.status || 'Active',
        notes: target.notes || '',
        reservoir: target.target_data?.reservoir || '',
        ppfg_project_id: target.target_data?.ppfg_project_id || 'none',
        dip: target.target_data?.dip || '',
        azimuth: target.target_data?.azimuth || '',
      });
    } else {
      setFormData({
        name: '',
        target_type: 'Point',
        tvd_m: '',
        tvdss: '',
        md_estimate: '',
        x: '',
        y: '',
        tolerance_radius: '10',
        priority: 'Medium',
        status: 'Active',
        notes: '',
        reservoir: '',
        ppfg_project_id: 'none',
        dip: '',
        azimuth: '',
      });
    }
    setErrors({});
  }, [target, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.tvd_m) newErrors.tvd_m = "TVD is required";
    if (!formData.x) newErrors.x = "Easting (X) is required";
    if (!formData.y) newErrors.y = "Northing (Y) is required";
    
    // Logic check
    if (parseFloat(formData.tolerance_radius) < 0) newErrors.tolerance_radius = "Radius must be positive";
    if (formData.tvd_m && parseFloat(formData.tvd_m) < 0) newErrors.tvd_m = "TVD usually positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    
    const submissionData = {
      ...formData,
      // Convert necessary fields to numbers for the parent handler
      tvd_m: parseFloat(formData.tvd_m),
      x: parseFloat(formData.x),
      y: parseFloat(formData.y),
      priority: formData.priority === 'High' ? 1 : formData.priority === 'Medium' ? 2 : 3,
      target_data: {
        tvdss: formData.tvdss ? parseFloat(formData.tvdss) : null,
        md_estimate: formData.md_estimate ? parseFloat(formData.md_estimate) : null,
        tolerance_radius: formData.tolerance_radius ? parseFloat(formData.tolerance_radius) : null,
        reservoir: formData.reservoir,
        ppfg_project_id: formData.ppfg_project_id,
        status: formData.status,
        dip: formData.dip ? parseFloat(formData.dip) : null,
        azimuth: formData.azimuth ? parseFloat(formData.azimuth) : null,
      }
    };

    await onSave(submissionData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold">
            <Target className="mr-2 text-[#4CAF50] h-6 w-6"/> {target ? 'Edit Target' : 'Create New Target'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geometry" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="geometry">Geometry & Location</TabsTrigger>
            <TabsTrigger value="details">Details & Integration</TabsTrigger>
          </TabsList>
          
          <div className="py-4">
            <TabsContent value="geometry" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Name *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)} 
                    className={`bg-slate-800 border-slate-700 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g. Reservoir Top"
                  />
                  {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Target Type</Label>
                  <Select value={formData.target_type} onValueChange={v => handleChange('target_type', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Point">Point Target</SelectItem>
                      <SelectItem value="Window">Window (Circular)</SelectItem>
                      <SelectItem value="Plane">Surface Intersection</SelectItem>
                      <SelectItem value="Polygon">Polygonal Boundary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Easting (X) *</Label>
                  <Input type="number" value={formData.x} onChange={e => handleChange('x', e.target.value)} className={`bg-slate-800 border-slate-700 ${errors.x ? 'border-red-500' : ''}`} />
                </div>
                <div className="space-y-2">
                  <Label>Northing (Y) *</Label>
                  <Input type="number" value={formData.y} onChange={e => handleChange('y', e.target.value)} className={`bg-slate-800 border-slate-700 ${errors.y ? 'border-red-500' : ''}`} />
                </div>
                <div className="space-y-2">
                  <Label>TVD (m) *</Label>
                  <Input type="number" value={formData.tvd_m} onChange={e => handleChange('tvd_m', e.target.value)} className={`bg-slate-800 border-slate-700 ${errors.tvd_m ? 'border-red-500' : ''}`} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>TVDSS (m)</Label>
                  <Input type="number" value={formData.tvdss} onChange={e => handleChange('tvdss', e.target.value)} className="bg-slate-800 border-slate-700" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>MD Estimate (m)</Label>
                  <Input type="number" value={formData.md_estimate} onChange={e => handleChange('md_estimate', e.target.value)} className="bg-slate-800 border-slate-700" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Tolerance Radius (m)</Label>
                  <Input type="number" value={formData.tolerance_radius} onChange={e => handleChange('tolerance_radius', e.target.value)} className="bg-slate-800 border-slate-700" />
                </div>
              </div>

              {formData.target_type === 'Plane' && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800/50 rounded border border-slate-800">
                  <div className="space-y-2">
                    <Label>Dip (°)</Label>
                    <Input type="number" value={formData.dip} onChange={e => handleChange('dip', e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Azimuth (°)</Label>
                    <Input type="number" value={formData.azimuth} onChange={e => handleChange('azimuth', e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={v => handleChange('priority', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="High">High (Critical)</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low (Secondary)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={v => handleChange('status', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Reached">Reached</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reservoir / Formation</Label>
                <Input value={formData.reservoir} onChange={e => handleChange('reservoir', e.target.value)} className="bg-slate-800 border-slate-700" />
              </div>

              <div className="space-y-2">
                <Label>Link to PPFG Case</Label>
                <Select value={formData.ppfg_project_id} onValueChange={v => handleChange('ppfg_project_id', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select PPFG Project..." /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="none">No Link</SelectItem>
                    {ppfgProjects && ppfgProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.ppfg_project_id !== 'none' && (
                  <div className="flex items-center text-xs text-yellow-400 mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Target will be validated against pore pressure window
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description / Notes</Label>
                <Textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} className="bg-slate-800 border-slate-700 h-24" placeholder="Geological context, risks, etc." />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#4CAF50] hover:bg-[#43a047] text-white">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TargetDialog;