import React from 'react';
import { Presentation } from 'lucide-react';

const PublicationAndPresentationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Presentation className="w-6 h-6 text-indigo-400"/> Publication & Presentation
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            Guidelines for presenting velocity models to management, partners, or academic journals.
        </p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Reproducibility:</strong> Always document the exact parameters (V0, k, anisotropy) so others can rebuild the model.</li>
            <li><strong>Uncertainty Transparency:</strong> Never present a single depth map without an accompanying uncertainty or error map.</li>
            <li><strong>Blind Test Results:</strong> Include a table showing the error statistics for wells <em>not</em> used in the calibration.</li>
        </ul>
      </div>
    </div>
  );
};

export default PublicationAndPresentationGuide;