import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const StatRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center text-sm py-1">
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-slate-200">{value} <span className="text-slate-600 text-xs">{unit}</span></span>
  </div>
);

const ObjectStatisticsPanel = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-sm text-white">Model Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Counts</h4>
          <StatRow label="Channels" value="12" />
          <StatRow label="Lobes" value="5" />
          <StatRow label="Faults" value="8" />
        </div>
        <Separator className="bg-slate-800" />
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Volumes</h4>
          <StatRow label="Total GRV" value="45.2" unit="MMm³" />
          <StatRow label="Net Sand" value="28.1" unit="MMm³" />
          <StatRow label="Net-to-Gross" value="0.62" unit="" />
        </div>
        <Separator className="bg-slate-800" />
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Properties (Avg)</h4>
          <StatRow label="Porosity" value="0.22" unit="v/v" />
          <StatRow label="Permeability" value="450" unit="mD" />
          <StatRow label="Saturation" value="0.35" unit="v/v" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectStatisticsPanel;