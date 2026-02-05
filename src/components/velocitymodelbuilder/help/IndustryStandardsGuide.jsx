import React from 'react';
import { Scale } from 'lucide-react';

const IndustryStandardsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Scale className="w-6 h-6 text-slate-300"/> Industry Standards
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            Adherence to standards ensures data interoperability and legal compliance.
        </p>
        <ul className="space-y-2">
            <li className="flex items-center gap-2"><span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">SEG</span> Society of Exploration Geophysicists (SEGY, SEGD formats).</li>
            <li className="flex items-center gap-2"><span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">EPSG</span> European Petroleum Survey Group (Coordinate Systems).</li>
            <li className="flex items-center gap-2"><span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">RESQML</span> Energistics standard for earth model exchange.</li>
        </ul>
      </div>
    </div>
  );
};

export default IndustryStandardsGuide;