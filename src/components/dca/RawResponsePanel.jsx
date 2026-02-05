import React from 'react';
import { motion } from 'framer-motion';

const RawResponsePanel = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-4">API Response</h2>
      <pre id="api-response-container" className="bg-black/50 text-lime-300 p-4 rounded-md text-xs overflow-x-auto max-h-96">
        {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
      </pre>
    </motion.div>
  );
};

export default RawResponsePanel;