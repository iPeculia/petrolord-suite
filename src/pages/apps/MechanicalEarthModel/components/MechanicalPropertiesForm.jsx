import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Wand, Undo, Redo, Save, Loader2 } from 'lucide-react';
import { GuidedModeContext } from '../contexts/GuidedModeContext';
import { useToast } from '@/components/ui/use-toast';

const propertyPresets = {
  sandstone: { poissonRatio: 0.20, frictionAngle: 35, cohesion: 5, youngsModulus: 30 },
  shale: { poissonRatio: 0.35, frictionAngle: 20, cohesion: 10, youngsModulus: 15 },
  limestone: { poissonRatio: 0.30, frictionAngle: 40, cohesion: 20, youngsModulus: 50 },
  dolomite: { poissonRatio: 0.28, frictionAngle: 45, cohesion: 25, youngsModulus: 60 },
  salt: { poissonRatio: 0.25, frictionAngle: 0, cohesion: 1, youngsModulus: 25 },
};

const validationRules = {
  poissonRatio: { min: 0.0, max: 0.5, message: "Must be between 0.0 and 0.5" },
  frictionAngle: { min: 0, max: 90, message: "Must be between 0 and 90 degrees" },
  cohesion: { min: 0, message: "Cannot be negative" },
  youngsModulus: { min: 0.1, message: "Must be a positive value" },
};

const PropertyInput = ({ name, label, unit, tooltip, register, errors }) => {
  const { min, max } = validationRules[name] || {};
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label htmlFor={name} className="text-sm text-slate-300 flex items-center">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-slate-500 ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="relative">
        <Input
          id={name}
          type="number"
          step="any"
          {...register(name, {
            valueAsNumber: true,
            required: 'This field is required',
            min: { value: min, message: `Min value is ${min}` },
            max: { value: max, message: `Max value is ${max}` },
          })}
          className={`pr-12 bg-slate-950 border-slate-700 text-slate-200 ${errors[name] ? 'border-red-500' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 text-sm">
          {unit}
        </div>
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
      </div>
    </div>
  );
};

const MechanicalPropertiesForm = () => {
    const { state, dispatch, saveMechanicalProperties, undo, redo, canUndo, canRedo } = useContext(GuidedModeContext);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: state.mechanicalProperties,
    });
    const { toast } = useToast();

    useEffect(() => {
        const subscription = watch((value) => {
            dispatch({ type: 'UPDATE_MECHANICAL_PROPERTIES', payload: value });
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);
    
    useEffect(() => {
        setValue('poissonRatio', state.mechanicalProperties.poissonRatio)
        setValue('frictionAngle', state.mechanicalProperties.frictionAngle)
        setValue('cohesion', state.mechanicalProperties.cohesion)
        setValue('youngsModulus', state.mechanicalProperties.youngsModulus)
    }, [state.mechanicalProperties, setValue]);

    const applyPreset = (presetName) => {
        const preset = propertyPresets[presetName];
        if (preset) {
            dispatch({ type: 'UPDATE_MECHANICAL_PROPERTIES', payload: preset });
            toast({ title: 'Preset Applied', description: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} properties have been loaded.` });
        }
    };

    const onSubmit = async (data) => {
      await saveMechanicalProperties(data);
    };

    return (
        <Card className="bg-slate-900/50 border-slate-800 text-slate-200">
            <CardHeader>
                <CardTitle>Mechanical Properties</CardTitle>
                <CardDescription>Define the rock mechanical properties for the zone of interest.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex-1">
                            <Select onValueChange={applyPreset}>
                                <SelectTrigger className="bg-slate-950 border-slate-700 h-9">
                                    <Wand className="w-4 h-4 mr-2 text-slate-400"/>
                                    <SelectValue placeholder="Apply a Preset..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    {Object.keys(propertyPresets).map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => undo('mechanicalProperties')} disabled={!canUndo('mechanicalProperties')}><Undo className="w-4 h-4"/></Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => redo('mechanicalProperties')} disabled={!canRedo('mechanicalProperties')}><Redo className="w-4 h-4"/></Button>
                        </div>
                    </div>
                    
                    <PropertyInput name="poissonRatio" label="Poisson's Ratio" unit="" tooltip="Ratio of transverse to axial strain." register={register} errors={errors} />
                    <PropertyInput name="frictionAngle" label="Friction Angle" unit="°" tooltip="Governs the failure of materials under shear stress." register={register} errors={errors} />
                    <PropertyInput name="cohesion" label="Cohesion" unit="MPa" tooltip="The intrinsic shear strength of the rock." register={register} errors={errors} />
                    <PropertyInput name="youngsModulus" label="Young's Modulus" unit="GPa" tooltip="A measure of the stiffness of the rock." register={register} errors={errors} />

                    <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500" disabled={state.calculationStatus === 'saving'}>
                        {state.calculationStatus === 'saving' ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
                        {state.calculationStatus === 'saving' ? 'Saving...' : 'Save Properties'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default MechanicalPropertiesForm;