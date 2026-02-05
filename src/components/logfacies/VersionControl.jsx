import React from 'react';
import { GitBranch, GitCommit, RotateCcw, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const versions = [
    { id: 'v3.0', msg: 'Updated porosity cutoffs', date: 'Just now', user: 'Alex', current: true },
    { id: 'v2.1', msg: 'Added manual overrides in Zone B', date: '2 hours ago', user: 'Sarah', current: false },
    { id: 'v2.0', msg: 'Switched to XGBoost Model', date: 'Yesterday', user: 'Alex', current: false },
    { id: 'v1.0', msg: 'Initial Import', date: '2 days ago', user: 'System', current: false },
];

const VersionControl = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    <GitBranch className="w-4 h-4 text-orange-400" /> Version History
                </CardTitle>
                <Button size="sm" variant="outline" className="h-8"><GitCommit className="w-3 h-3 mr-2"/> Commit</Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full">
                    <div className="relative p-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-slate-800 before:content-['']">
                        {versions.map((ver, i) => (
                            <div key={i} className="relative flex items-start gap-4 group">
                                <div className={`absolute left-0 ml-6 -translate-x-1/2 rounded-full border-4 border-slate-900 ${ver.current ? 'h-4 w-4 bg-green-500' : 'h-3 w-3 bg-slate-600 group-hover:bg-blue-500 transition-colors'}`}></div>
                                <div className={`flex-1 ml-8 p-3 rounded-lg border ${ver.current ? 'bg-slate-800 border-green-900/50' : 'bg-slate-950 border-slate-800 group-hover:border-slate-700'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className={`text-sm font-mono font-bold ${ver.current ? 'text-green-400' : 'text-slate-300'}`}>{ver.id}</span>
                                            <span className="mx-2 text-slate-600">•</span>
                                            <span className="text-xs text-slate-400">{ver.user}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {ver.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-2">{ver.msg}</p>
                                    {!ver.current && (
                                        <Button size="xs" variant="ghost" className="h-6 text-slate-500 hover:text-blue-400 p-0">
                                            <RotateCcw className="w-3 h-3 mr-1"/> Rollback
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default VersionControl;