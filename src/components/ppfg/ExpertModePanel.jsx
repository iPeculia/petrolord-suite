import React from 'react';
import ParameterSliderPanel from './ParameterSliderPanel';
import { ScrollArea } from '@/components/ui/scroll-area';

const ExpertModePanel = ({ currentParams, updateParam }) => {
  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-950">
            <h3 className="font-bold text-slate-200">Parameter Tuning</h3>
            <p className="text-xs text-slate-500">Fine-tune predictive models</p>
        </div>
        <ScrollArea className="flex-1 p-4">
            <ParameterSliderPanel params={currentParams} updateParam={updateParam} />
            
            <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Equation Preview</h4>
                <div className="font-mono text-xs text-emerald-500 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
                    PP = OBG - (OBG - Ph) * (DTn/DT)^{currentParams.eatonExponent}
                </div>
                <div className="mt-2 font-mono text-xs text-blue-400 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
                    FG = PP + ({currentParams.poissonRatio} / (1 - {currentParams.poissonRatio})) * (OBG - PP)
                </div>
            </div>
        </ScrollArea>
    </div>
  );
};

export default ExpertModePanel;