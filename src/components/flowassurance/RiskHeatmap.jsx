import React from 'react';
    import { motion } from 'framer-motion';

    const RiskHeatmap = ({ data }) => {
      const getRiskColor = (score) => {
        if (score > 0.75) return 'bg-red-500';
        if (score > 0.50) return 'bg-orange-500';
        if (score > 0.25) return 'bg-yellow-500';
        return 'bg-green-500';
      };

      return (
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-4">Pipeline Risk Profile</h4>
          <div className="flex w-full h-12 rounded-md overflow-hidden border-2 border-slate-700">
            {data.map((segment, index) => (
              <motion.div
                key={index}
                className={`h-full flex-1 group relative ${getRiskColor(segment.totalRisk)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p>Dist: {(segment.distance / 1000).toFixed(1)}kft</p>
                  <p>Total Risk: {(segment.totalRisk * 100).toFixed(0)}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-2 text-xs text-slate-300">
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-green-500 mr-1"></div>Low</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-yellow-500 mr-1"></div>Medium</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-orange-500 mr-1"></div>High</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-red-500 mr-1"></div>Critical</div>
          </div>
        </div>
      );
    };

    export default RiskHeatmap;