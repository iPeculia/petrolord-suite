import React from 'react';
import { Cloud } from 'lucide-react';

const CloudComputingGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Cloud className="w-6 h-6 text-blue-300"/> Cloud Computing & Scalability
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300 space-y-4">
        <p>
            Velocity Model Builder is cloud-native. It scales resources dynamically based on your workload.
        </p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Storage:</strong> All project data is stored in geo-redundant object storage (S3/Blob).</li>
            <li><strong>Compute:</strong> Heavy tasks like Kriging a 10 million cell grid or running 1000 Monte Carlo simulations are offloaded to serverless workers.</li>
            <li><strong>Collaboration:</strong> Real-time state sync allows multiple geoscientists to edit the same model layer simultaneously (like Google Docs for velocity).</li>
        </ul>
      </div>
    </div>
  );
};

export default CloudComputingGuide;