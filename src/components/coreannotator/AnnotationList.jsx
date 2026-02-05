import React from 'react';

const AnnotationList = ({ annotations, onSelect, selectedId }) => {
  return (
    <div className="space-y-2">
      {annotations.map(ann => (
        <button
          key={ann.id}
          onClick={() => onSelect(ann)}
          className={`w-full text-left p-2 rounded-md transition-colors ${selectedId === ann.id ? 'bg-lime-500/20' : 'bg-white/5 hover:bg-white/10'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{ann.label}</span>
            <span className="text-xs text-slate-400">{ann.depth}m</span>
          </div>
          <p className="text-sm text-slate-300">Confidence: {ann.confidence}%</p>
        </button>
      ))}
    </div>
  );
};

export default AnnotationList;