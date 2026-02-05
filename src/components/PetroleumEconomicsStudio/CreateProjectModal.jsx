import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePetroleumEconomics } from '@/pages/apps/PetroleumEconomicsStudio/contexts/PetroleumEconomicsContext';
import { Loader2 } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { createProject, loading } = usePetroleumEconomics();

  const onSubmit = async (data) => {
    const result = await createProject(data);
    if (result) {
        reset();
        onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Economic Project</DialogTitle>
          <DialogDescription className="text-slate-400">
            Start a new evaluation. A base model and scenario will be created automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
                id="name" 
                placeholder="e.g. North Sea Development Phase 1" 
                className="bg-slate-800 border-slate-700 text-white"
                {...register('name', { required: 'Project name is required' })}
            />
            {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                    id="location" 
                    placeholder="Region / Basin" 
                    className="bg-slate-800 border-slate-700 text-white"
                    {...register('location')}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                    id="country" 
                    placeholder="Country" 
                    className="bg-slate-800 border-slate-700 text-white"
                    {...register('country')}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
                id="description" 
                placeholder="Brief summary of the project goals..." 
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;