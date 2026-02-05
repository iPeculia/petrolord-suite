import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';

const TankSetupForm = () => {
  const { reservoirMetadata, updateReservoirMetadata } = useMaterialBalance();
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm({
    defaultValues: reservoirMetadata
  });

  // Sync context to form when metadata changes externally (e.g. load project)
  useEffect(() => {
    Object.keys(reservoirMetadata).forEach(key => {
      setValue(key, reservoirMetadata[key]);
    });
  }, [reservoirMetadata, setValue]);

  const onSubmit = (data) => {
    // Convert numeric strings to numbers
    const numericFields = ['area', 'thickness', 'phi', 'Swi', 'cf', 'cw', 'cr', 'GOC0', 'OWC0', 'datum'];
    const processed = { ...data };
    numericFields.forEach(field => {
      processed[field] = parseFloat(data[field]);
    });

    updateReservoirMetadata(processed);
    toast({ title: "Saved", description: "Reservoir parameters updated." });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full overflow-hidden flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Reservoir Parameters</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          
          {/* Basic Info */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Reservoir Name</Label>
                <Input {...register('name')} className="h-7 text-xs bg-slate-950 border-slate-700" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Fluid Type</Label>
                <Select onValueChange={(val) => setValue('type', val)} defaultValue={reservoirMetadata.type}>
                  <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">Oil</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="condensate">Condensate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Drive Mechanism</Label>
              <Select onValueChange={(val) => setValue('driveType', val)} defaultValue={reservoirMetadata.driveType}>
                <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depletion">Depletion Drive</SelectItem>
                  <SelectItem value="water">Water Drive</SelectItem>
                  <SelectItem value="gascap">Gas Cap Drive</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Geometry & Rock */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500">GEOMETRY & ROCK</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Area (acres)</Label>
                <Input type="number" step="any" {...register('area')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Net Thickness (ft)</Label>
                <Input type="number" step="any" {...register('thickness')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Porosity (frac)</Label>
                <Input type="number" step="0.01" {...register('phi')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Swi (frac)</Label>
                <Input type="number" step="0.01" {...register('Swi')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
            </div>
          </div>

          {/* Compressibility */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500">COMPRESSIBILITY (1/psi)</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Rock (cf)</Label>
                <Input type="number" step="1e-7" {...register('cf')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Water (cw)</Label>
                <Input type="number" step="1e-7" {...register('cw')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
            </div>
          </div>

          {/* Initial Contacts */}
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-slate-500">INITIAL CONTACTS (ft)</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">GOC</Label>
                <Input type="number" step="any" {...register('GOC0')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">OWC</Label>
                <Input type="number" step="any" {...register('OWC0')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-[10px] text-slate-400">Reference Datum</Label>
                <Input type="number" step="any" {...register('datum')} className="h-7 text-xs bg-slate-950 border-slate-700 font-mono" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-xs h-8 mt-4">
            Update Parameters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TankSetupForm;