import React from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CertificationAndTraining = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Award className="w-6 h-6 text-yellow-400" /> Certification Program
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Level 1: Associate', 'Level 2: Professional', 'Level 3: Expert'].map((level, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col">
                <div className="flex-1">
                    <h3 className="text-white font-bold mb-4 text-lg">{level}</h3>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle className="w-3 h-3 text-emerald-500"/> 5 Modules</li>
                        <li className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle className="w-3 h-3 text-emerald-500"/> Final Exam</li>
                        <li className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle className="w-3 h-3 text-emerald-500"/> Certificate</li>
                    </ul>
                </div>
                <Button className="w-full bg-slate-800 hover:bg-slate-700">Enroll Now</Button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationAndTraining;