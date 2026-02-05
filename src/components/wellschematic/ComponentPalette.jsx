import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Minus, Anchor, GitCommitHorizontal, Shield } from 'lucide-react';
import DraggableComponent from './DraggableComponent';

const paletteItems = [
  { id: 'casing', name: 'Casing', type: 'casing', icon: Layers },
  { id: 'tubing', name: 'Tubing', type: 'tubing', icon: Minus },
  { id: 'packer', name: 'Packer', type: 'packer', icon: Anchor },
  { id: 'sliding_sleeve', name: 'Sliding Sleeve', type: 'sliding_sleeve', icon: GitCommitHorizontal },
  { id: 'sssv', name: 'SSSV', type: 'sssv', icon: Shield },
];

const ComponentPalette = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-slate-800/50 border-r border-slate-700 p-4 flex-shrink-0 overflow-y-auto"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Components</h2>
      <div className="space-y-2">
        {paletteItems.map((item) => (
          <DraggableComponent key={item.id} item={item}>
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-grab transition-colors">
              <item.icon className="w-5 h-5 text-indigo-300" />
              <span className="text-sm font-medium text-white">{item.name}</span>
            </div>
          </DraggableComponent>
        ))}
      </div>
    </motion.div>
  );
};

export default ComponentPalette;