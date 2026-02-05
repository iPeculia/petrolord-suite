import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Image as ImageIcon, BarChartHorizontal } from 'lucide-react';
import { DcaChartPanel } from '@/components/dca/DcaChartPanel';
import DcaKpiPanel from '@/components/dca/DcaKpiPanel';
import { RawResponsePanel } from '@/components/dca/RawResponsePanel';

const ResultsPanel = ({ results }) => {
  const { toast } = useToast();
  
  const handleExport = (type) => {
    toast({
      title: `Exporting ${type}...`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 3000,
    });
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Run an analysis to see the results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DcaKpiPanel results={results} />
      <DcaChartPanel results={results} />
      <RawResponsePanel data={results} />
    </div>
  );
};

export default ResultsPanel;