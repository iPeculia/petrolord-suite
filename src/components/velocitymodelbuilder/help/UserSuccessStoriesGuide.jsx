import React from 'react';
import { Trophy } from 'lucide-react';

const UserSuccessStoriesGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500"/> User Success Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Major North Sea Operator</h3>
            <p className="text-sm text-slate-400">
                "Reduced depth conversion turnaround time from 2 weeks to 2 hours using Petrolord's automated checkshot QC workflow. Drilled the target within 3m tolerance."
            </p>
        </div>
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Indie Explorer in Africa</h3>
            <p className="text-sm text-slate-400">
                "The ability to run P10/P90 scenarios on the cloud allowed us to quantify spill-point risk rapidly during a license round bid."
            </p>
        </div>
      </div>
    </div>
  );
};

export default UserSuccessStoriesGuide;