import React from 'react';
import { Leaf } from 'lucide-react';

const EnvironmentalAndSustainabilityGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Leaf className="w-6 h-6 text-green-400"/> Sustainability & Green Computing
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            Efficient algorithms save energy.
        </p>
        <ul className="space-y-2">
            <li><strong>Serverless Architecture:</strong> We only spin up compute resources when you run a model, eliminating idle server energy waste.</li>
            <li><strong>Optimized Code:</strong> Our WebAssembly modules run 10x faster than interpreted JS, reducing CPU cycles and carbon footprint.</li>
            <li><strong>Paperless Reporting:</strong> Digital-first interactive reports reduce the need for printing massive map books.</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvironmentalAndSustainabilityGuide;