import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { CheckCircle2, ChevronRight, ChevronLeft, Wand2, Info, AlertCircle } from 'lucide-react';
import { usePetroleumEconomics } from '@/pages/apps/PetroleumEconomicsStudio/contexts/PetroleumEconomicsContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { id: 1, title: 'Model Basics', desc: 'Define timeline and parameters' },
  { id: 2, title: 'Production', desc: 'Set volumes and decline rates' },
  { id: 3, title: 'Costs', desc: 'Estimate CAPEX and OPEX' },
  { id: 4, title: 'Prices', desc: 'Market price assumptions' },
  { id: 5, title: 'Fiscal', desc: 'Government take and tax' },
  { id: 6, title: 'Summary', desc: 'Review and finish' },
];

const InputWizard = ({ isOpen, onClose }) => {
  const { 
    modelSettings, 
    setModelSettings, 
    setProductionData, 
    setCostData, 
    setPriceAssumptions, 
    setFiscalTerms,
    updateAssumptions
  } = usePetroleumEconomics();
  
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Local state for the wizard form (simplified view)
  const [formData, setFormData] = useState({
    startYear: new Date().getFullYear(),
    duration: 20,
    discountRate: 10,
    
    // Production
    initialOilRate: 0,
    initialGasRate: 0,
    declineRate: 15,
    plateauYears: 2,

    // Costs
    drillingCapex: 0,
    facilitiesCapex: 0,
    fixedOpex: 0,
    variableOpex: 0,

    // Prices
    oilPrice: 70,
    gasPrice: 3.5,
    
    // Fiscal
    royaltyRate: 12.5,
    taxRate: 30
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleUseDemo = (section) => {
    let updates = {};
    if (section === 'basics') {
        updates = { startYear: new Date().getFullYear(), duration: 20, discountRate: 10 };
    } else if (section === 'production') {
        updates = { initialOilRate: 5000, initialGasRate: 2000, declineRate: 15, plateauYears: 3 };
    } else if (section === 'costs') {
        updates = { drillingCapex: 15000000, facilitiesCapex: 5000000, fixedOpex: 500000, variableOpex: 5.5 };
    } else if (section === 'prices') {
        updates = { oilPrice: 75, gasPrice: 3.5 };
    } else if (section === 'fiscal') {
        updates = { royaltyRate: 12.5, taxRate: 35 };
    }
    setFormData(prev => ({ ...prev, ...updates }));
    toast({ title: "Demo Values Applied", description: `Default values loaded for ${section}.` });
  };

  const generateDataAndSave = () => {
    // 1. Settings
    const newSettings = {
        ...modelSettings,
        startYear: parseInt(formData.startYear),
        endYear: parseInt(formData.startYear) + parseInt(formData.duration) - 1,
        discountRate: parseFloat(formData.discountRate) / 100
    };
    setModelSettings(newSettings);

    // 2. Production
    const prodArray = [];
    const endYear = newSettings.endYear;
    let currentOil = parseFloat(formData.initialOilRate);
    let currentGas = parseFloat(formData.initialGasRate);
    const declineDec = parseFloat(formData.declineRate) / 100;
    
    for (let y = newSettings.startYear; y <= endYear; y++) {
        const yearIdx = y - newSettings.startYear;
        // Simple plateau logic
        if (yearIdx >= formData.plateauYears) {
            currentOil = currentOil * (1 - declineDec);
            currentGas = currentGas * (1 - declineDec);
        }
        
        prodArray.push({
            year: y,
            oil_rate: Math.round(currentOil * 365), // Annualized
            gas_rate: Math.round(currentGas * 365),
            condensate_rate: 0,
            notes: yearIdx === 0 ? 'Wizard Generated' : ''
        });
    }
    setProductionData(prodArray);

    // 3. Costs
    const capexArray = [];
    const opexArray = [];
    for (let y = newSettings.startYear; y <= endYear; y++) {
        const yearIdx = y - newSettings.startYear;
        
        // Simple CAPEX spread: Facilities Year 0, Drilling Year 0 & 1
        let drill = 0;
        let fac = 0;
        if (yearIdx === 0) {
            drill = parseFloat(formData.drillingCapex) * 0.6;
            fac = parseFloat(formData.facilitiesCapex);
        } else if (yearIdx === 1) {
            drill = parseFloat(formData.drillingCapex) * 0.4;
        }

        capexArray.push({
            year: y,
            drilling_capex: drill,
            facilities_capex: fac,
            abandonment_capex: yearIdx === (formData.duration - 1) ? 1000000 : 0, // Simple abex at end
            other_capex: 0
        });

        opexArray.push({
            year: y,
            fixed_opex: parseFloat(formData.fixedOpex),
            variable_oil: parseFloat(formData.variableOpex),
            variable_gas: 0.5,
            variable_water: 0
        });
    }
    setCostData({ capexProfile: capexArray, opexProfile: opexArray });

    // 4. Prices
    setPriceAssumptions(prev => ({
        ...prev,
        oilPrice: parseFloat(formData.oilPrice),
        gasPrice: parseFloat(formData.gasPrice)
    }));

    // 5. Fiscal
    setFiscalTerms(prev => ({
        ...prev, // Keep existing template type
        template_type: prev?.template_type || 'royalty_tax',
        royalty_rate: parseFloat(formData.royaltyRate),
        tax_rate: parseFloat(formData.taxRate)
    }));
    
    // Also update assumptions context for side panel consistency
    updateAssumptions({
        royaltyRate: parseFloat(formData.royaltyRate),
        taxRate: parseFloat(formData.taxRate)
    });

    onClose();
    toast({ title: "Setup Complete", description: "Model populated with wizard data." });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Start Year</Label>
                    <Input type="number" value={formData.startYear} onChange={(e) => setFormData({...formData, startYear: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Duration (Years)</Label>
                    <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Discount Rate (%)</Label>
                <div className="flex items-center gap-4">
                    <Slider 
                        value={[formData.discountRate]} 
                        max={25} 
                        step={0.5} 
                        onValueChange={(val) => setFormData({...formData, discountRate: val[0]})} 
                        className="flex-1"
                    />
                    <Input 
                        type="number" 
                        className="w-20" 
                        value={formData.discountRate} 
                        onChange={(e) => setFormData({...formData, discountRate: e.target.value})} 
                    />
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleUseDemo('basics')} className="w-full border border-dashed border-slate-700 text-slate-400 mt-2">
                <Wand2 className="w-3 h-3 mr-2" /> Use Demo Values
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Initial Oil Rate (bopd)</Label>
                    <Input type="number" value={formData.initialOilRate} onChange={(e) => setFormData({...formData, initialOilRate: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Initial Gas Rate (Mcfd)</Label>
                    <Input type="number" value={formData.initialGasRate} onChange={(e) => setFormData({...formData, initialGasRate: e.target.value})} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Plateau Period (Years)</Label>
                    <Input type="number" value={formData.plateauYears} onChange={(e) => setFormData({...formData, plateauYears: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Decline Rate (%/yr)</Label>
                    <Input type="number" value={formData.declineRate} onChange={(e) => setFormData({...formData, declineRate: e.target.value})} />
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleUseDemo('production')} className="w-full border border-dashed border-slate-700 text-slate-400 mt-2">
                <Wand2 className="w-3 h-3 mr-2" /> Use Demo Values
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-1">Capital Expenditure (Total)</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Drilling & Completion ($)</Label>
                    <Input type="number" value={formData.drillingCapex} onChange={(e) => setFormData({...formData, drillingCapex: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Facilities & Infra ($)</Label>
                    <Input type="number" value={formData.facilitiesCapex} onChange={(e) => setFormData({...formData, facilitiesCapex: e.target.value})} />
                </div>
            </div>
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-1 mt-2">Operating Expenditure</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Fixed OPEX ($/year)</Label>
                    <Input type="number" value={formData.fixedOpex} onChange={(e) => setFormData({...formData, fixedOpex: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Variable OPEX ($/bbl)</Label>
                    <Input type="number" value={formData.variableOpex} onChange={(e) => setFormData({...formData, variableOpex: e.target.value})} />
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleUseDemo('costs')} className="w-full border border-dashed border-slate-700 text-slate-400 mt-2">
                <Wand2 className="w-3 h-3 mr-2" /> Use Demo Values
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
                <Label>Oil Price ($/bbl)</Label>
                <Input type="number" value={formData.oilPrice} onChange={(e) => setFormData({...formData, oilPrice: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Gas Price ($/Mcf)</Label>
                <Input type="number" value={formData.gasPrice} onChange={(e) => setFormData({...formData, gasPrice: e.target.value})} />
            </div>
            <div className="bg-slate-950/50 p-3 rounded border border-slate-800 text-xs text-slate-400">
                <Info className="w-3 h-3 inline mr-1" /> Flat pricing model will be applied. You can edit yearly prices later in the Setup tab.
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleUseDemo('prices')} className="w-full border border-dashed border-slate-700 text-slate-400 mt-2">
                <Wand2 className="w-3 h-3 mr-2" /> Use Demo Values
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Royalty Rate (%)</Label>
                    <Input type="number" value={formData.royaltyRate} onChange={(e) => setFormData({...formData, royaltyRate: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Corporate Tax Rate (%)</Label>
                    <Input type="number" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: e.target.value})} />
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleUseDemo('fiscal')} className="w-full border border-dashed border-slate-700 text-slate-400 mt-2">
                <Wand2 className="w-3 h-3 mr-2" /> Use Demo Values
            </Button>
          </div>
        );
      case 6:
        return (
            <div className="space-y-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 space-y-3">
                        <SummaryRow label="Project Duration" value={`${formData.duration} Years`} step={1} setCurrentStep={setCurrentStep} />
                        <SummaryRow label="Discount Rate" value={`${formData.discountRate}%`} step={1} setCurrentStep={setCurrentStep} />
                        <SummaryRow label="Initial Oil Rate" value={`${formData.initialOilRate} bopd`} step={2} setCurrentStep={setCurrentStep} />
                        <SummaryRow label="Total CAPEX" value={`$${(parseFloat(formData.drillingCapex) + parseFloat(formData.facilitiesCapex)).toLocaleString()}`} step={3} setCurrentStep={setCurrentStep} />
                        <SummaryRow label="Oil Price" value={`$${formData.oilPrice}/bbl`} step={4} setCurrentStep={setCurrentStep} />
                        <SummaryRow label="Govt Royalty" value={`${formData.royaltyRate}%`} step={5} setCurrentStep={setCurrentStep} />
                    </CardContent>
                </Card>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 p-3 rounded border border-emerald-900/50">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Ready to build model!</span>
                </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle>Input Wizard</DialogTitle>
            <span className="text-xs text-slate-500 font-mono">Step {currentStep} of {steps.length}</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-white">{steps[currentStep-1].title}</h3>
            <DialogDescription className="text-slate-400">{steps[currentStep-1].desc}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-4 min-h-[300px]">
            {renderStepContent()}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="ghost" onClick={currentStep === 1 ? onClose : handleBack} className="text-slate-400">
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className="flex gap-2">
            {currentStep < 6 ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            ) : (
                <Button onClick={generateDataAndSave} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    Finish & Build Model
                </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SummaryRow = ({ label, value, step, setCurrentStep }) => (
    <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0">
        <span className="text-slate-400">{label}</span>
        <div className="flex items-center gap-3">
            <span className="font-medium text-slate-200">{value}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-blue-400" onClick={() => setCurrentStep(step)}>
                <Info className="w-3 h-3" />
            </Button>
        </div>
    </div>
);

export default InputWizard;