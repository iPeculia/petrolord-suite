import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { BarChart, Download, FileText, GitBranch, TrendingUp, DollarSign, Settings, AlertTriangle } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import NodalPlot from './NodalPlot';

const ResultsPanel = ({ results }) => {
  const { kpis, plotsData, recommendations } = results;
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format} report...`,
    });
  };

  const kpiCards = [
    { key: 'currentRate', label: 'Current Oil Rate', unit: 'STB/day', icon: TrendingUp },
    { key: 'currentRevenue', label: 'Current Revenue', unit: '$/day', icon: DollarSign },
    { key: 'currentChoke', label: 'Current Choke', unit: '%', icon: Settings },
    { key: 'status', label: 'Operating Status', unit: '', icon: AlertTriangle },
  ];
  
  const recommendationCards = [
    { key: 'choke', label: 'Recommended Choke', unit: '%', icon: Settings },
    { key: 'liftRate', label: 'Recommended Lift', unit: 'Hz', icon: TrendingUp },
    { key: 'incrementalRate', label: 'Incremental Oil', unit: 'STB/day', icon: TrendingUp },
    { key: 'revenueUplift', label: 'Revenue Uplift', unit: '$/day', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <CollapsibleSection title="Current Performance" icon={<BarChart />} defaultOpen>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(({ key, label, unit, icon: Icon }) => (
            <motion.div key={key} className={`bg-white/5 p-4 rounded-lg ${key === 'status' && kpis[key] !== 'On-Design' ? 'bg-red-500/20' : ''}`}>
              <div className="flex items-center space-x-3">
                <Icon className={`w-6 h-6 ${key === 'status' && kpis[key] !== 'On-Design' ? 'text-red-400' : 'text-lime-300'}`} />
                <p className="text-sm text-lime-200">{label}</p>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{kpis[key]} <span className="text-lg text-lime-300">{unit}</span></p>
            </motion.div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Interactive Nodal Analysis Plot" icon={<GitBranch />} defaultOpen>
        <NodalPlot data={plotsData} />
      </CollapsibleSection>
      
      <CollapsibleSection title="Recommended Settings & Uplift" icon={<TrendingUp />} defaultOpen>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendationCards.map(({ key, label, unit, icon: Icon }) => (
            <motion.div key={key} className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-green-300" />
                <p className="text-sm text-green-200">{label}</p>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{recommendations[key]} <span className="text-lg text-green-300">{unit}</span></p>
            </motion.div>
          ))}
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