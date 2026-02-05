import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const CourseManagement = () => (
    <div className="h-full p-1 space-y-4">
        <div className="flex justify-between">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-400" /> Courses
            </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {['Intro to EMS', 'Advanced Petrophysics', 'Admin Certification'].map((c, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800 hover:bg-slate-900 cursor-pointer">
                    <CardContent className="p-4">
                        <div className="h-24 bg-slate-900 rounded mb-3 flex items-center justify-center text-slate-700">Cover Image</div>
                        <h4 className="font-bold text-slate-200 text-sm">{c}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">4 Modules • 2h 15m</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);
export default CourseManagement;