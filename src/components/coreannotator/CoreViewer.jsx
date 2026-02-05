import React from 'react';
import { motion } from 'framer-motion';

const CoreViewer = ({ imageSrc, annotations, selectedAnnotation }) => {
  const colorMap = {
    'Sandstone': 'border-yellow-400',
    'Shale': 'border-gray-400',
    'Fracture': 'border-red-500',
    'Burrow': 'border-green-400',
  };

  return (
    <div className="relative w-full h-full overflow-auto bg-slate-900 rounded-md">
      <img-replace src={imageSrc} alt="Core sample" className="w-full h-auto" />
      {annotations.map(ann => (
        <motion.div
          key={ann.id}
          className={`absolute ${colorMap[ann.label] || 'border-cyan-400'} border-2 rounded-sm transition-all duration-300`}
          style={{
            left: `${ann.box[0]}%`,
            top: `${ann.box[1]}%`,
            width: `${ann.box[2]}%`,
            height: `${ann.box[3]}%`,
            boxShadow: selectedAnnotation?.id === ann.id ? '0 0 15px 5px rgba(52, 211, 153, 0.7)' : 'none',
            backgroundColor: selectedAnnotation?.id === ann.id ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.2)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: ann.id * 0.1 }}
        >
          <span className="absolute -top-6 left-0 text-xs bg-black/50 text-white px-1 rounded">
            {ann.label} ({ann.confidence}%)
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default CoreViewer;