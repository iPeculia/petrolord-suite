import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';

const PatternRecognition = () => {
    return (
        <div className="space-y-4 h-full p-1">
             <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><LayoutGrid className="w-4 h-4 mr-2 text-blue-400"/> Seismic Facies Classification</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="aspect-square bg-slate-900 rounded border border-slate-800 flex items-center justify-center relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 group-hover:opacity-50 transition-opacity" />
                                <span className="text-xs text-slate-500 z-10">Class {i}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                        Unsupervised clustering identified 6 distinct seismic facies patterns in the target zone.
                    </p>
                </CardContent>
             </Card>
        </div>
    );
};

export default PatternRecognition;