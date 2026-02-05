import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, PlayCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamTrainingProgram = () => {
  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Training & Certification</h2>
        
        <div className="grid grid-cols-1 gap-4">
            <Card className="bg-slate-900 border-slate-800 flex flex-col md:flex-row overflow-hidden">
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 w-full md:w-48 flex items-center justify-center p-6">
                    <GraduationCap className="w-16 h-16 text-blue-400" />
                </div>
                <CardContent className="flex-1 p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Velocity Modeling Certification</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        A comprehensive 3-level certification program designed for Geoscientists and Geodesists.
                        Covers theory, software application, and advanced QC workflows.
                    </p>
                    <div className="flex gap-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Start Basic Course</Button>
                        <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">View Syllabus</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default TeamTrainingProgram;