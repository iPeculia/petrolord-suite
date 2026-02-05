import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Settings2, BarChart3, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DistributionInput = ({ label, paramKey, values, onInputChange, unit, helpText }) => {
    const [isAdvanced, setIsAdvanced] = useState(false);

    const handleDistChange = (value) => {
        onInputChange(paramKey, 'dist', value);
    };

    const handleValueChange = (field, value) => {
        onInputChange(paramKey, field, value);
    };

    const renderInputs = () => {
        const dist = values.dist || 'triangular';
        
        switch (dist) {
            case 'normal':
                return (
                    <div className="grid grid-cols-2 gap-2">
                         <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Mean</span>
                            <Input type="number" value={values.mean} onChange={(e) => handleValueChange('mean', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs" placeholder="Mean" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Std Dev</span>
                            <Input type="number" value={values.stdDev} onChange={(e) => handleValueChange('stdDev', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs" placeholder="StdDev" />
                        </div>
                    </div>
                );
            case 'uniform':
                return (
                     <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Min</span>
                            <Input type="number" value={values.min} onChange={(e) => handleValueChange('min', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Max</span>
                            <Input type="number" value={values.max} onChange={(e) => handleValueChange('max', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs" />
                        </div>
                    </div>
                );
            case 'constant':
                 return (
                     <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Value</span>
                        <Input type="number" value={values.p50} onChange={(e) => handleValueChange('p50', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs" />
                    </div>
                 );
            case 'triangular':
            default:
                return (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Min / P10</span>
                        <Input type="number" value={values.p10 || values.min} onChange={(e) => handleValueChange(values.dist === 'triangular' ? 'min' : 'p10', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs text-left" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Mode / P50</span>
                        <Input type="number" value={values.p50 || values.mode} onChange={(e) => handleValueChange(values.dist === 'triangular' ? 'mode' : 'p50', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs text-left border-l-2 border-l-lime-500" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Max / P90</span>
                        <Input type="number" value={values.p90 || values.max} onChange={(e) => handleValueChange(values.dist === 'triangular' ? 'max' : 'p90', e.target.value)} className="bg-white/5 border-white/10 h-8 text-xs text-left" />
                      </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Label className="text-slate-200 font-medium text-sm m-0">{label}</Label>
                    {unit && <span className="text-xs text-slate-500">({unit})</span>}
                    {helpText && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-slate-700 text-xs max-w-[200px]">
                                    {helpText}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <Select value={values.dist || 'triangular'} onValueChange={handleDistChange}>
                    <SelectTrigger className="w-[110px] h-7 text-xs bg-slate-950 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="triangular">Triangular</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="lognormal">Lognormal</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="constant">Constant</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderInputs()}
        </div>
    );
};


const InputPanel = ({ inputs, onInputChange, onControlChange, onRun, loading }) => {
  const units = {
    area: inputs.unit_system === 'field' ? 'acres' : 'km²',
    thickness: inputs.unit_system === 'field' ? 'ft' : 'm',
  };

  const fvf_oil_label = 'Boi (rb/stb)';
  const fvf_gas_label = 'Bg (rcf/scf)';

  return (
    <div className="lg:col-span-1 space-y-6 h-full flex flex-col">
      {/* Configuration Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-lime-400" />
                Simulation Config
             </h2>
             <Badge variant="outline" className="text-[10px] border-lime-500/50 text-lime-400 bg-lime-500/10">
                 Monte Carlo
             </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="space-y-2">
                <Label className="text-xs text-slate-400">Simulations</Label>
                <Select value={String(inputs.n_sim)} onValueChange={(v) => onControlChange('n_sim', parseInt(v))}>
                    <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1000">1,000 (Fast)</SelectItem>
                        <SelectItem value="5000">5,000 (Standard)</SelectItem>
                        <SelectItem value="10000">10,000 (High Res)</SelectItem>
                        <SelectItem value="50000">50,000 (Precision)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-slate-400">Unit System</Label>
                 <div className="flex bg-slate-950 rounded p-1 border border-slate-800">
                    <button 
                        onClick={() => onControlChange('unit_system', 'field')}
                        className={`flex-1 text-xs rounded py-1 transition-colors ${inputs.unit_system === 'field' ? 'bg-slate-700 text-white font-medium shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >Field</button>
                    <button 
                        onClick={() => onControlChange('unit_system', 'metric')}
                        className={`flex-1 text-xs rounded py-1 transition-colors ${inputs.unit_system === 'metric' ? 'bg-slate-700 text-white font-medium shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >Metric</button>
                 </div>
             </div>
        </div>
        
        <div className="space-y-2">
            <Label className="text-xs text-slate-400">Fluid Phase</Label>
            <div className="flex bg-slate-950 rounded p-1 border border-slate-800">
                {['oil', 'gas', 'gas_oil'].map(p => (
                    <button 
                        key={p}
                        onClick={() => onControlChange('phase', p)}
                        className={`flex-1 text-xs rounded py-1 capitalize transition-colors ${inputs.phase === p ? 'bg-lime-600 text-white font-medium shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {p.replace('_', ' & ')}
                    </button>
                ))}
            </div>
        </div>
      </motion.div>

      {/* Parameters Card - Scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex-1 flex flex-col min-h-0"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Input Parameters
        </h3>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <DistributionInput 
            label="Gross Rock Volume / Area" 
            paramKey="area" 
            values={inputs.area} 
            onInputChange={onInputChange} 
            unit={units.area} 
            helpText="Total area of the reservoir structure."
          />
          <DistributionInput 
            label="Net Thickness" 
            paramKey="thickness" 
            values={inputs.thickness} 
            onInputChange={onInputChange} 
            unit={units.thickness} 
            helpText="Vertical thickness of the reservoir pay zone."
          />
          <DistributionInput 
            label="Porosity" 
            paramKey="porosity_pct" 
            values={inputs.porosity_pct} 
            onInputChange={onInputChange} 
            unit="%" 
            helpText="Effective porosity percentage."
          />
          <DistributionInput 
            label="Water Saturation" 
            paramKey="sw_pct" 
            values={inputs.sw_pct} 
            onInputChange={onInputChange} 
            unit="%" 
            helpText="Initial water saturation percentage."
          />
          
          {(inputs.phase === 'oil' || inputs.phase === 'gas_oil') &&
            <DistributionInput 
                label="Oil FVF" 
                paramKey="fv_factor" 
                values={inputs.fv_factor} 
                onInputChange={onInputChange} 
                unit={fvf_oil_label} 
                helpText="Oil Formation Volume Factor (Reservoir bbl / Stock tank bbl)"
            />
          }
          {(inputs.phase === 'gas' || inputs.phase === 'gas_oil') &&
            <DistributionInput 
                label="Gas FVF" 
                paramKey="fv_factor_gas" 
                values={inputs.fv_factor_gas} 
                onInputChange={onInputChange} 
                unit={fvf_gas_label} 
                helpText="Gas Formation Volume Factor"
            />
          }
           
           {/* Advanced / Secondary parameters */}
           <div className="pt-4 mt-4 border-t border-white/5">
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recovery & Net Pay</h4>
             <div className="space-y-3">
                <DistributionInput 
                    label="Net-to-Gross" 
                    paramKey="net_to_gross" 
                    values={inputs.net_to_gross || { dist: 'constant', p50: 100 }} 
                    onInputChange={onInputChange} 
                    unit="%" 
                    helpText="Ratio of pay thickness to gross thickness."
                />
                <DistributionInput 
                    label="Recovery Factor" 
                    paramKey="recovery_pct" 
                    values={inputs.recovery_pct} 
                    onInputChange={onInputChange} 
                    unit="%" 
                    helpText="Expected recovery efficiency percentage."
                />
             </div>
           </div>
        </div>

        <Button 
            onClick={onRun} 
            disabled={loading} 
            className="w-full mt-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white shadow-lg shadow-lime-900/20"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              <span>Simulating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center font-semibold tracking-wide">
              <Play className="w-4 h-4 mr-2 fill-current" />
              RUN SIMULATION
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default InputPanel;