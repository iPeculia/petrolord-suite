import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, AlertTriangle, Package } from 'lucide-react';

const BundleAnalyzer = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-400" /> Bundle Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Total Initial Size</div>
                        <div className="text-2xl font-bold text-white mt-1">486 KB</div>
                        <div className="text-[10px] text-green-400 mt-1">↓ 12% from last build</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Largest Chunk</div>
                        <div className="text-xl font-bold text-white mt-1">three.js (vendor)</div>
                        <div className="text-[10px] text-orange-400 mt-1">142 KB (Gzipped)</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Code Splitting</div>
                        <div className="text-2xl font-bold text-white mt-1">24 Chunks</div>
                        <div className="text-[10px] text-blue-400 mt-1">Lazy loaded effectively</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-950 border-slate-800 flex-grow">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Module Tree Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] relative bg-slate-900 m-4 rounded border border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 flex flex-wrap">
                        <div className="h-full w-[40%] bg-blue-900/20 border border-blue-800/50 flex items-center justify-center text-xs text-blue-300" title="Three.js">
                            Three.js
                        </div>
                        <div className="h-full w-[30%] bg-purple-900/20 border border-purple-800/50 flex flex-col">
                            <div className="h-[60%] w-full border-b border-purple-800/50 flex items-center justify-center text-xs text-purple-300">React DOM</div>
                            <div className="h-[40%] w-full flex items-center justify-center text-xs text-purple-300">React</div>
                        </div>
                        <div className="h-full w-[30%] bg-green-900/20 border border-green-800/50 flex flex-wrap">
                            <div className="h-1/2 w-1/2 border border-green-800/50 flex items-center justify-center text-[10px] text-green-300">Deck.gl</div>
                            <div className="h-1/2 w-1/2 border border-green-800/50 flex items-center justify-center text-[10px] text-green-300">ECharts</div>
                            <div className="h-1/2 w-full border border-green-800/50 flex items-center justify-center text-[10px] text-green-300">App Code</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BundleAnalyzer;