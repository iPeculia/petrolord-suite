import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Card, CardContent } from '@/components/ui/card';

const MetricCard = ({ label, value, unit, color = "text-slate-100" }) => (
  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      {unit && <span className="text-xs text-slate-500">{unit}</span>}
    </div>
  </div>
);

const DCAKPICards = () => {
  const { modelParameters, currentWell } = useDeclineCurve();
  
  if (!currentWell) return null;

  const formatNum = (n) => typeof n === 'number' ? n.toFixed(2) : '-';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        label="Initial Rate (qi)" 
        value={formatNum(modelParameters.qi)} 
        unit="bbl/d" 
        color="text-blue-400"
      />
      <MetricCard 
        label="Decline Rate (Di)" 
        value={formatNum(modelParameters.Di)} 
        unit="%/yr"
      />
      <MetricCard 
        label="b-Factor" 
        value={formatNum(modelParameters.b)} 
        color="text-green-400"
      />
      <MetricCard 
        label="EUR" 
        value="-" 
        unit="Mbbl"
      />
    </div>
  );
};

export default DCAKPICards;