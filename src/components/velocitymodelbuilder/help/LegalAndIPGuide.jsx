import React from 'react';
import { Scale } from 'lucide-react';

const LegalAndIPGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Scale className="w-6 h-6 text-slate-300"/> Legal & Intellectual Property
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300 space-y-4">
        <p>
            <strong>Data Ownership:</strong> You retain 100% ownership of all data, models, and velocity functions created within the platform.
        </p>
        <p>
            <strong>Confidentiality:</strong> Your models are encrypted and isolated. Our support team cannot access your project data without explicit temporary permission.
        </p>
        <p>
            <strong>Export Rights:</strong> You are free to export your models to any format and use them in any other software package without restriction.
        </p>
      </div>
    </div>
  );
};

export default LegalAndIPGuide;