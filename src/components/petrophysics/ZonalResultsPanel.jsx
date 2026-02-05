import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Droplets, Wind } from 'lucide-react';

const KPICard = ({ id, title, value, unit, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-slate-800/50 border border-white/10 rounded-xl p-6 flex flex-col justify-between`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p id={id} className="text-4xl font-bold text-white">
        {value ?? '--'}
      </p>
      <p className="text-slate-400">{unit}</p>
    </div>
  </motion.div>
);

const ZonalResultsPanel = ({ results }) => {
  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Petrophysical Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
                id="vshale-output"
                title="Volume of Shale"
                value={results?.volume_of_shale_percent}
                unit="%"
                icon={<BarChart2 className="w-6 h-6 text-white" />}
                color="from-yellow-500 to-amber-500"
                delay={0.2}
            />
            <KPICard
                id="sw-output"
                title="Water Saturation"
                value={results?.water_saturation_percent}
                unit="%"
                icon={<Droplets className="w-6 h-6 text-white" />}
                color="from-blue-500 to-cyan-500"
                delay={0.3}
            />
            <KPICard
                id="shc-output"
                title="Hydrocarbon Saturation"
                value={results?.hydrocarbon_saturation_percent}
                unit="%"
                icon={<Wind className="w-6 h-6 text-white" />}
                color="from-red-500 to-pink-500"
                delay={0.4}
            />
        </div>
    </div>
  );
};

export default ZonalResultsPanel;