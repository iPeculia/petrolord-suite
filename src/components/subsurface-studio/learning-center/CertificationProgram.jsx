import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const CertificationProgram = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" /> Certifications
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-900/20 border border-yellow-600/50 flex items-center justify-center">
                    <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                    <h4 className="font-bold text-white">Certified EMS Professional</h4>
                    <p className="text-xs text-slate-400">Requires: Course Completion + Final Exam (80% passing)</p>
                    <div className="mt-2 text-[10px] text-slate-500">Issued: 42 this month</div>
                </div>
            </CardContent>
        </Card>
    </div>
);
export default CertificationProgram;