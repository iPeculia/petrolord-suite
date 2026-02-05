import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Info, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePetroleumEconomics } from '@/pages/apps/PetroleumEconomicsStudio/contexts/PetroleumEconomicsContext';

const AssumptionsMiniPanel = () => {
  const { assumptions, updateAssumptions, saving } = usePetroleumEconomics();
  const [isOpen, setIsOpen] = useState(true);
  const [localData, setLocalData] = useState(assumptions || {});
  const [dirtyFields, setDirtyFields] = useState({});

  useEffect(() => {
    setLocalData(assumptions || {});
  }, [assumptions]);

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setDirtyFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    if (dirtyFields[field]) {
      updateAssumptions({ [field]: localData[field] });
      setDirtyFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const fields = [
    { id: 'workingInterest', label: 'Working Interest', unit: '%', tooltip: 'Your company&apos;s equity share in the project.' },
    { id: 'netRevenueInterest', label: 'Net Rev. Interest', unit: '%', tooltip: 'Share of revenue after royalties.' },
    { id: 'uptime', label: 'Uptime / Availability', unit: '%', tooltip: 'Expected operational efficiency.' },
    { id: 'shrinkage', label: 'Shrinkage Factor', unit: '%', tooltip: 'Volume loss due to processing/transport.' },
    { id: 'tariffOil', label: 'Oil Tariff', unit: '$/bbl', tooltip: 'Transportation cost per barrel.' },
    { id: 'tariffGas', label: 'Gas Tariff', unit: '$/Mcf', tooltip: 'Transportation cost per Mcf.' },
    { id: 'liftingCostBase', label: 'Lifting Cost', unit: '$/boe', tooltip: 'Direct cost to lift a barrel of oil equivalent.' },
    { id: 'taxRate', label: 'Corporate Tax Rate', unit: '%', tooltip: 'Applicable corporate income tax.' },
    { id: 'royaltyRate', label: 'Royalty Rate', unit: '%', tooltip: 'Gross overriding royalty paid to owner.' },
  ];

  return (
    <div className={`border-l border-slate-800 bg-slate-900 transition-all duration-300 flex flex-col ${isOpen ? 'w-80' : 'w-12'} shrink-0 z-30`}>
      <div className="flex items-center justify-between p-3 border-b border-slate-800 h-14 shrink-0">
        {isOpen && <h3 className="font-semibold text-slate-200 text-sm">Key Assumptions</h3>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 text-slate-400 hover:text-white ml-auto">
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {isOpen && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id} className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    {field.label}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><Info className="w-3 h-3 opacity-50 hover:opacity-100 cursor-help" /></TooltipTrigger>
                        <TooltipContent><p dangerouslySetInnerHTML={{ __html: field.tooltip }} /></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  {dirtyFields[field.id] ? (
                    <span className="text-[10px] text-yellow-500 animate-pulse">Unsaved</span>
                  ) : saving ? (
                     <span className="text-[10px] text-slate-500">Saving...</span>
                  ) : (
                     <Check className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="relative">
                  <Input
                    id={field.id}
                    type="number"
                    value={localData[field.id] !== undefined ? localData[field.id] : ''}
                    onChange={(e) => handleChange(field.id, parseFloat(e.target.value))}
                    onBlur={() => handleBlur(field.id)}
                    className="h-8 text-sm bg-slate-950 border-slate-800 focus:border-blue-500 pr-8 text-right"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-slate-500 pointer-events-none">
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Export assumptions</span>
                    <Button variant="link" className="h-auto p-0 text-blue-400 text-xs">JSON</Button>
                </div>
            </div>
          </div>
        </ScrollArea>
      )}
      
      {!isOpen && (
          <div className="flex flex-col items-center py-4 gap-4">
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                            <Info className="w-5 h-5 text-slate-500" />
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Assumptions</TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
      )}
    </div>
  );
};

export default AssumptionsMiniPanel;