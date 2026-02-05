import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';
import WellErrorHandler from './WellErrorHandler';

const WellCreationForm = ({ onSubmit, onCancel, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    x: '',
    y: '',
    z_surface: '',
    z_datum: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-200">Add New Well</h3>
        <p className="text-xs text-slate-500">Enter well coordinates and details.</p>
      </div>

      <WellErrorHandler error={error} />

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="name" className="text-slate-400">Well Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-slate-950 border-slate-700 focus:border-blue-500 text-white"
            placeholder="e.g., Well-A1"
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x" className="text-slate-400">X Coordinate</Label>
            <Input 
              id="x" 
              type="number"
              value={formData.x}
              onChange={(e) => handleChange('x', e.target.value)}
              className="bg-slate-950 border-slate-700"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y" className="text-slate-400">Y Coordinate</Label>
            <Input 
              id="y" 
              type="number"
              value={formData.y}
              onChange={(e) => handleChange('y', e.target.value)}
              className="bg-slate-950 border-slate-700"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading} className="text-slate-400 hover:text-white">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[100px]"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Create Well</>}
        </Button>
      </div>
    </form>
  );
};

export default WellCreationForm;