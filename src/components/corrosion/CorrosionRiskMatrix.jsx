import React from 'react';
import { motion } from 'framer-motion';

const CorrosionRiskMatrix = ({ corrosionRateCategory, sscRisk }) => {
  const sscRiskLevels = ['Severe', 'Moderate', 'Low'];
  const corrosionRateLevels = ['Low', 'Moderate', 'High', 'Severe'];

  const riskMatrixData = {
    'Severe': { 'Low': 'High', 'Moderate': 'High', 'High': 'Critical', 'Severe': 'Critical' },
    'Moderate': { 'Low': 'Medium', 'Moderate': 'High', 'High': 'High', 'Severe': 'Critical' },
    'Low': { 'Low': 'Low', 'Moderate': 'Medium', 'High': 'High', 'Severe': 'High' },
  };

  const riskColors = {
    'Low': 'bg-green-500',
    'Medium': 'bg-yellow-500',
    'High': 'bg-orange-500',
    'Critical': 'bg-red-600',
  };

  const sscIndex = sscRiskLevels.indexOf(sscRisk);
  const corrosionIndex = corrosionRateLevels.indexOf(corrosionRateCategory);

  return (
    <div className="p-4 rounded-lg bg-slate-900/50">
      <h4 className="font-semibold text-white mb-4 text-center">Corrosion Risk Matrix</h4>
      <div className="flex">
        <div className="flex flex-col justify-between text-xs text-slate-400 pr-2 py-4 text-right">
          <span className="h-1/3 flex items-center justify-end font-bold">Severe</span>
          <span className="h-1/3 flex items-center justify-end font-bold">Moderate</span>
          <span className="h-1/3 flex items-center justify-end font-bold">Low</span>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-4 grid-rows-3 gap-1 relative aspect-[4/3]">
            {sscRiskLevels.map((sRisk, rowIndex) =>
              corrosionRateLevels.map((cRisk, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`rounded ${riskColors[riskMatrixData[sRisk][cRisk]]} opacity-50`}
                />
              ))
            )}
            {sscIndex !== -1 && corrosionIndex !== -1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute w-1/4 h-1/3 p-1"
                style={{
                  top: `${sscIndex * (100 / 3)}%`,
                  left: `${corrosionIndex * 25}%`,
                }}
              >
                <div className="w-full h-full rounded bg-white/30 border-2 border-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow-2xl shadow-white" />
                </div>
              </motion.div>
            )}
          </div>
          <div className="grid grid-cols-4 text-xs text-slate-400 pt-2 text-center">
            {corrosionRateLevels.map(level => <span key={level} className="font-bold">{level}</span>)}
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-4 text-slate-300 font-semibold">CO₂ Corrosion Rate →</div>
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-slate-300 font-semibold">SSC Risk →</div>
    </div>
  );
};

export default CorrosionRiskMatrix;