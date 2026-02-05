import React, { useState, useEffect } from 'react';
import { usePetroleumEconomics } from '@/pages/apps/PetroleumEconomicsStudio/contexts/PetroleumEconomicsContext';
import { Lightbulb, ArrowRight, X, Play, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const SmartGuidance = () => {
  const { currentModel, activeScenario, productionData, economicsStatus, loadDemoModel, runEconomics } = usePetroleumEconomics();
  const [isVisible, setIsVisible] = useState(true);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    if (!currentModel) {
        setSuggestion({
            title: "Create a Model",
            message: "Start your evaluation by creating a new project or model structure.",
            action: null // Handled by UI elsewhere usually
        });
    } else if (!activeScenario) {
        setSuggestion({
            title: "Create Scenario",
            message: "Scenarios hold your inputs. Create one to begin.",
            action: null
        });
    } else if (!productionData || productionData.length === 0 || productionData.every(r => r.oil_rate === 0 && r.gas_rate === 0)) {
        setSuggestion({
            title: "Empty Model",
            message: "Your model has no production data. Load a template to get started quickly.",
            action: "Load Demo",
            handler: () => loadDemoModel('well')
        });
    } else if (economicsStatus === 'not_run') {
        setSuggestion({
            title: "Ready to Calculate",
            message: "Inputs detected. Run the economic engine to view NPV and Cashflows.",
            action: "Run Economics",
            handler: () => runEconomics(true)
        });
    } else {
        setSuggestion(null);
    }
  }, [currentModel, activeScenario, productionData, economicsStatus]);

  if (!isVisible || !suggestion) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-blue-500/30 shadow-2xl rounded-xl p-4 flex items-start gap-4 ring-1 ring-white/10"
      >
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shrink-0 shadow-lg shadow-blue-900/20">
            <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 pt-0.5">
            <h4 className="font-semibold text-slate-100 text-sm mb-1">{suggestion.title}</h4>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">{suggestion.message}</p>
            {suggestion.action && (
                <Button 
                    size="sm" 
                    onClick={suggestion.handler}
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20"
                >
                    {suggestion.action === 'Load Demo' && <Wand2 className="w-3 h-3 mr-1.5" />}
                    {suggestion.action === 'Run Economics' && <Play className="w-3 h-3 mr-1.5 fill-current" />}
                    {suggestion.action} 
                </Button>
            )}
        </div>
        <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors -mt-1 -mr-1 p-1">
            <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartGuidance;