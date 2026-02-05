import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CommonMistakesAndPitfalls = () => {
  const mistakes = [
    { title: "Mixing Datums", desc: "Combining onshore (MSL) and offshore (LAT) wells without datum shift correction." },
    { title: "Over-smoothing", desc: "Applying too large a smoothing filter, masking real geological velocity contrasts." },
    { title: "Ignoring Anisotropy", desc: "Forcing an isotropic model on a shale basin, leading to significant depth misties." },
    { title: "Checkshot Polarity", desc: "Using time-depth pairs with incorrect polarity or time shift (SRD vs KB)." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" /> Common Mistakes
      </h2>
      <div className="grid gap-4">
        {mistakes.map((m, i) => (
            <div key={i} className="bg-slate-900 border-l-4 border-l-red-500 border-y border-r border-slate-800 p-4 rounded-r">
                <h4 className="text-red-400 font-bold text-sm mb-1">{m.title}</h4>
                <p className="text-slate-400 text-xs">{m.desc}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CommonMistakesAndPitfalls;