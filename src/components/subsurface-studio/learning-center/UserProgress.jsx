import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

const UserProgress = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Users className="w-5 h-5 mr-2 text-cyan-400" /> Learner Progress
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4 space-y-4">
                {[
                    { user: 'John Doe', course: 'Intro to EMS', progress: 75 },
                    { user: 'Jane Smith', course: 'Advanced Mapping', progress: 32 },
                    { user: 'Bob Wilson', course: 'Intro to EMS', progress: 100 },
                ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="w-1/3">
                            <div className="text-sm text-white">{u.user}</div>
                            <div className="text-[10px] text-slate-500">{u.course}</div>
                        </div>
                        <Progress value={u.progress} className="h-2 flex-grow" />
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{u.progress}%</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);
export default UserProgress;