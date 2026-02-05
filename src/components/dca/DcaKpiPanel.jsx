import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Percent, Hash, CheckCircle, AlertCircle, Calendar, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const KPICard = ({ title, value, unit, icon, color, delay, id }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-slate-800/50 border border-white/10 rounded-xl p-4 flex flex-col justify-between`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p id={id} className="text-2xl font-bold text-white font-mono">
        {value ?? '--'}
      </p>
      {unit && <p className="text-xs text-slate-400">{unit}</p>}
    </div>
  </motion.div>
);

const DcaKpiPanel = ({ results }) => {
  if (!results) return null;

  const { fitted_params, fit_quality, econ_limit, notes } = results;
  const autoModel = notes?.find(n => n.startsWith("Auto-selected model:"))?.split(":")[1]?.trim();
  const isSegmented = notes?.some(n => n.includes("segmentation"));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white">Key Performance Indicators</h2>
        {isSegmented && <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">Segmented Fit</Badge>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard id="kpi-model" title="Model" value={autoModel || fitted_params.model} icon={<BarChart className="w-5 h-5 text-white" />} color="from-blue-500 to-cyan-500" delay={0.1} />
        <KPICard id="kpi-qi" title="Initial Rate (qi)" value={fitted_params.qi?.toFixed(2)} unit="rate/day" icon={<TrendingUp className="w-5 h-5 text-white" />} color="from-green-500 to-emerald-500" delay={0.2} />
        <KPICard id="kpi-di" title="Decline Rate (Di)" value={fitted_params.di?.toFixed(4)} unit="nominal/day" icon={<Percent className="w-5 h-5 text-white" />} color="from-orange-500 to-amber-500" delay={0.3} />
        <KPICard id="kpi-b" title="b-Exponent" value={fitted_params.b?.toFixed(2)} unit="dimensionless" icon={<Hash className="w-5 h-5 text-white" />} color="from-purple-500 to-pink-500" delay={0.4} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard id="kpi-r2" title="R²" value={fit_quality.r_squared?.toFixed(4)} icon={<CheckCircle className="w-5 h-5 text-white" />} color="from-teal-500 to-cyan-500" delay={0.5} />
        <KPICard id="kpi-rmse" title="RMSE" value={fit_quality.rmse?.toExponential(2)} icon={<AlertCircle className="w-5 h-5 text-white" />} color="from-red-500 to-orange-500" delay={0.6} />
        <KPICard id="kpi-t-econ" title="Time to Econ Limit" value={econ_limit.t_econ_days?.toLocaleString(undefined, {maximumFractionDigits: 0})} unit="days" icon={<Calendar className="w-5 h-5 text-white" />} color="from-yellow-500 to-amber-500" delay={0.7} />
        <KPICard id="kpi-eur" title="EUR at Econ Limit" value={econ_limit.eur_at_econ_limit?.toLocaleString(undefined, {maximumFractionDigits: 0})} unit="total rate" icon={<BarChart className="w-5 h-5 text-white" />} color="from-indigo-500 to-purple-500" delay={0.8} />
      </div>
    </div>
  );
};

export default DcaKpiPanel;