import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, FileText, BarChart2 } from 'lucide-react';

const KnowledgeBaseEngine = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Knowledge Base
                    </h3>
                    <p className="text-xs text-slate-400">Manage documentation, articles, and wikis.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-2" /> Search KB</Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700"><FileText className="w-4 h-4 mr-2" /> New Article</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Total Articles</div>
                        <div className="text-2xl font-bold text-white">248</div>
                        <div className="text-[10px] text-green-400 mt-1">+12 this month</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Most Viewed</div>
                        <div className="text-lg font-bold text-white truncate">Getting Started with 3D</div>
                        <div className="text-[10px] text-slate-400 mt-1">1,240 views</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Feedback Score</div>
                        <div className="text-2xl font-bold text-white">4.8/5.0</div>
                        <div className="text-[10px] text-slate-400 mt-1">Based on 340 ratings</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-950 border-slate-800 h-64">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Popular Categories</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {['Geophysics (85)', 'Drilling (42)', 'Platform Admin (31)', 'API Reference (28)'].map((cat, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
                                <span>{cat}</span>
                                <BarChart2 className="w-3 h-3 text-slate-500" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800 h-64 flex items-center justify-center text-slate-500 text-sm">
                    [Recent Activity Feed Placeholder]
                </Card>
            </div>
        </div>
    );
};

export default KnowledgeBaseEngine;