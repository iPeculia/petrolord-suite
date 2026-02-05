import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Database } from 'lucide-react';

const DataQualityPanel = ({ data }) => {
  if (!data) return null;

  const { issues, duplicates_removed, negatives_zeroed, rows_in, rows_out } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Data Quality Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
          <Database className="w-8 h-8 text-blue-300" />
          <div>
            <p className="text-sm text-blue-200">Rows In / Out</p>
            <p className="text-xl font-bold text-white">{rows_in} / {rows_out}</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-yellow-300" />
          <div>
            <p className="text-sm text-yellow-200">Duplicates Removed</p>
            <p className="text-xl font-bold text-white">{duplicates_removed}</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-orange-300" />
          <div>
            <p className="text-sm text-orange-200">Negatives Zeroed</p>
            <p className="text-xl font-bold text-white">{negatives_zeroed}</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
          <Check className="w-8 h-8 text-green-300" />
          <div>
            <p className="text-sm text-green-200">Other Issues</p>
            <p className="text-xl font-bold text-white">{issues?.length || 0}</p>
          </div>
        </div>
      </div>
      {issues && issues.length > 0 && (
        <div className="mt-4 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
          <h3 className="font-semibold text-yellow-200 mb-2">Data Issues Found:</h3>
          <ul className="list-disc list-inside text-yellow-300 text-sm space-y-1">
            {issues.map((issue, index) => <li key={index}>{issue}</li>)}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default DataQualityPanel;