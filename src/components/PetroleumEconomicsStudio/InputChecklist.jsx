import React from 'react';
import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePetroleumEconomics } from '@/pages/apps/PetroleumEconomicsStudio/contexts/PetroleumEconomicsContext';

const InputChecklist = ({ onLaunchWizard }) => {
  const { 
    productionData, 
    costData, 
    priceAssumptions, 
    fiscalTerms, 
    modelSettings 
  } = usePetroleumEconomics();

  // Determine status of each section
  const isSetupComplete = modelSettings.startYear && modelSettings.discountRate;
  const isProductionComplete = productionData && productionData.length > 0 && productionData.some(r => r.oil_rate > 0 || r.gas_rate > 0);
  const isCostsComplete = costData.capexProfile?.length > 0 || costData.opexProfile?.length > 0;
  const isPricesComplete = priceAssumptions.oilPrice > 0 || priceAssumptions.gasPrice > 0;
  const isFiscalComplete = fiscalTerms !== null;

  const steps = [
    { id: 'setup', label: 'Model Setup', complete: isSetupComplete },
    { id: 'production', label: 'Production Profile', complete: isProductionComplete },
    { id: 'costs', label: 'Costs (CAPEX/OPEX)', complete: isCostsComplete },
    { id: 'prices', label: 'Price Assumptions', complete: isPricesComplete },
    { id: 'fiscal', label: 'Fiscal Terms', complete: isFiscalComplete },
  ];

  const allComplete = steps.every(s => s.complete);

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-slate-200 flex items-center justify-between">
          <span>Input Checklist</span>
          <span className="text-xs font-normal text-slate-500">
            {steps.filter(s => s.complete).length}/{steps.length} Completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              {step.complete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
              <span className={cn(
                "flex-1",
                step.complete ? "text-slate-300 line-through decoration-slate-600" : "text-slate-400"
              )}>
                {step.label}
              </span>
              {!step.complete && (
                <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Required</span>
              )}
            </div>
          ))}
        </div>

        {allComplete ? (
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-3 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Ready to Calculate!</p>
              <p className="text-xs text-emerald-200/70 mt-1">All required inputs are present. You can now run the economic model.</p>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <Button onClick={onLaunchWizard} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Launch Input Wizard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InputChecklist;