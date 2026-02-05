import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight, Settings, Activity, Calculator, BarChart3, FileSpreadsheet, MousePointerClick } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const steps = [
  {
    id: 'setup',
    title: 'Create & Setup',
    icon: Settings,
    desc: 'Define project parameters, start year, and discount rate.',
    details: 'Start in the Setup tab. Choose a template or enter basic model settings manually.',
    color: 'bg-slate-800'
  },
  {
    id: 'inputs',
    title: 'Enter Inputs',
    icon: Activity,
    desc: 'Input production profiles, costs (CAPEX/OPEX), and prices.',
    details: 'Use the Production and Costs tabs. You can paste data from Excel or use the Import tool.',
    color: 'bg-blue-900/40'
  },
  {
    id: 'calc',
    title: 'Run Economics',
    icon: Calculator,
    desc: 'Execute the calculation engine to compute cashflows.',
    details: 'Click the "RUN ECONOMICS" button in the Setup tab or header. This processes all inputs.',
    color: 'bg-purple-900/40'
  },
  {
    id: 'results',
    title: 'View Results',
    icon: BarChart3,
    desc: 'Analyze NPV, IRR, and visual charts.',
    details: 'Check the Dashboard for KPIs and the Results tab for detailed annual cashflow tables.',
    color: 'bg-emerald-900/40'
  },
  {
    id: 'export',
    title: 'Export / Share',
    icon: FileSpreadsheet,
    desc: 'Generate PDF reports or export to Excel.',
    details: 'Use the Export tab to download professional reports or share findings with your team.',
    color: 'bg-amber-900/40'
  }
];

const WorkflowDiagram = () => {
  return (
    <div className="w-full overflow-x-auto py-6 px-4">
      <div className="flex items-center justify-between min-w-[800px] gap-4 relative">
        
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -z-10" />

        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <Popover>
              <PopoverTrigger asChild>
                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`w-40 h-40 flex flex-col items-center justify-center text-center p-4 border-slate-700 hover:border-blue-500 transition-colors ${step.color} backdrop-blur-sm`}>
                    <div className="p-3 rounded-full bg-slate-950 mb-3 border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                      <step.icon className="w-6 h-6 text-slate-300 group-hover:text-white" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-200">{step.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">{step.desc}</p>
                    
                    <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-blue-400">
                        <MousePointerClick className="w-3 h-3 mr-1" /> Details
                    </div>
                  </Card>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-slate-900 border-slate-800 text-slate-200 text-sm p-4">
                <div className="font-semibold text-white mb-1 flex items-center gap-2">
                    <step.icon className="w-4 h-4 text-blue-500" />
                    {step.title}
                </div>
                <p className="text-slate-400">{step.details}</p>
              </PopoverContent>
            </Popover>

            {idx < steps.length - 1 && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ delay: 0.5 + (idx * 0.1), duration: 0.5 }}
                className="flex-1 flex justify-center"
              >
                <ArrowRight className="w-5 h-5 text-slate-600 animate-pulse" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDiagram;