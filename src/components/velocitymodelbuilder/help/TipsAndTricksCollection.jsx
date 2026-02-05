import React from 'react';
import { Lightbulb } from 'lucide-react';

const TipsAndTricksCollection = () => {
  const tips = [
    "Use 'Z' key to quickly toggle zoom on any crossplot.",
    "Right-click on a well in the map view to exclude it from the current gridding run instantly.",
    "Hold 'Shift' while dragging layers to reorder them without recalculating.",
    "Save your favorite color scales as presets in the visualization tab."
  ];

  return (
    <div className="bg-gradient-to-r from-amber-900/10 to-transparent border border-amber-900/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-bold text-sm">Pro Tips & Tricks</h3>
        </div>
        <ul className="space-y-2">
            {tips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500/50 mt-0.5">•</span>
                    {tip}
                </li>
            ))}
        </ul>
    </div>
  );
};

export default TipsAndTricksCollection;