import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { BarChart, Download, Activity, BrainCircuit } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import BreakevenPlots from './BreakevenPlots';

const ResultsPanel = ({ results }) => {
  const { kpis, plotData, tornadoData, insights } = results;
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format} report...`,
    });
  };

  const kpiCards = [
    { key: 'p10', label: 'Breakeven (P10)' },
    { key: 'p50', label: 'Breakeven (P50)' },
    { key: 'p90', label: 'Breakeven (P90)' },
    { key: 'mean', label: 'Mean Breakeven' },
  ];

  return (
    <div className="space-y-6">
      <CollapsibleSection title="Breakeven Summary" icon={<BarChart />} defaultOpen>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(({ key, label }) => (
            <motion.div key={key} className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-lime-200">{label}</p>
              <p className="text-3xl font-bold text-white mt-2">
                {typeof kpis[key] === 'number' ? `${kpis[key].toFixed(2)}` : kpis[key]}
                <span className="text-lg text-lime-300">/STB</span>
              </p>
            </motion.div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Probabilistic Distributions & Sensitivity" icon={<Activity />} defaultOpen>
        <BreakevenPlots cdfData={plotData.cdf} histogramData={plotData.histogram} tornadoData={tornadoData} kpis={kpis}/>
      </CollapsibleSection>

      <CollapsibleSection title="Interpretation & Guidance (AI)" icon={<BrainCircuit />}>
        <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
            <p className="text-orange-200">{insights}</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Export Results" icon={<Download />}>
        <div className="bg-white/5 p-6 rounded-lg flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Download Your Analysis</h3>
            <div className="flex items-center gap-3">
                <Button onClick={() => handleExport('CSV')}><Download className="w-4 h-4 mr-2"/>Export Data</Button>
                <Button onClick={() => handleExport('PDF')}><Download className="w-4 h-4 mr-2"/>Export Report</Button>
            </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ResultsPanel;