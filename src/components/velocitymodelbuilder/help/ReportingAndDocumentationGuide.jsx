import React from 'react';
import { FileText } from 'lucide-react';

const ReportingAndDocumentationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <FileText className="w-6 h-6 text-slate-300"/> Reporting & Documentation
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 space-y-4">
        <p className="text-sm text-slate-400">
            A velocity model is useless if no one knows how it was built.
        </p>
        <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="text-white font-bold">The "Metadata" Standard</h3>
            <p className="text-xs text-slate-400 mt-1">
                Every exported grid must include metadata in the header:
                <br/>- Author
                <br/>- Creation Date
                <br/>- Algorithms Used (e.g., Kriging, Linear V=V0+kZ)
                <br/>- Input Data Cutoff Date
            </p>
        </div>
        <div className="border-l-2 border-emerald-500 pl-4">
            <h3 className="text-white font-bold">Automated QC Report</h3>
            <p className="text-xs text-slate-400 mt-1">
                Generate a PDF summary containing: Mistie histograms, V0 maps, and Crossplots of Vavg vs Depth for all wells.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ReportingAndDocumentationGuide;