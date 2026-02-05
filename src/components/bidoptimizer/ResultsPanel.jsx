import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BrainCircuit, BarChart, ScatterChart } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import OptimizerPlots from './OptimizerPlots';

const ResultsPanel = ({ results }) => {
  const { recommendations, portfolio, insights } = results;
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format} report...`,
    });
  };

  return (
    <div className="space-y-6">
      <CollapsibleSection title="Optimal Bid Recommendations" icon={<BarChart />} defaultOpen>
        <div className="bg-white/5 rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-white/20">
                        <TableHead className="text-white">Block</TableHead>
                        <TableHead className="text-white">Recommendation</TableHead>
                        <TableHead className="text-white text-right">Bid Amount ($MM)</TableHead>
                        <TableHead className="text-white text-right">Risked EMV ($MM)</TableHead>
                        <TableHead className="text-white text-right">POSc (%)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recommendations.map(rec => (
                        <TableRow key={rec.name} className={`border-b-0 ${rec.status === 'Bid' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <TableCell className="font-medium text-white">{rec.name}</TableCell>
                            <TableCell className={rec.status === 'Bid' ? 'text-green-300' : 'text-red-300'}>{rec.status}</TableCell>
                            <TableCell className="text-right text-white">{rec.bidAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-white">{rec.emv.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-white">{rec.posc.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Portfolio View & Sensitivity" icon={<ScatterChart />} defaultOpen>
        <OptimizerPlots portfolioData={portfolio} />
      </CollapsibleSection>

      <CollapsibleSection title="AI-Powered Rationale" icon={<BrainCircuit />}>
        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
            <p className="text-blue-200">{insights}</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Export Results" icon={<Download />}>
        <div className="bg-white/5 p-6 rounded-lg flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Download Your Strategy</h3>
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