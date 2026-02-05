import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const CrossSectionMeasurementTools = ({ measurement }) => {
    if (!measurement) return null;

    return (
        <Card className="bg-slate-900 border-t-4 border-t-green-500 border-x-0 border-b-0 rounded-none absolute bottom-0 left-0 right-0 z-20 shadow-2xl">
            <CardContent className="p-2 flex items-center justify-around text-xs font-mono">
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 uppercase text-[10px]">Vertical</span>
                    <span className="text-white font-bold">{measurement.dy?.toFixed(1)} m</span>
                </div>
                <div className="w-px h-6 bg-slate-700"></div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 uppercase text-[10px]">Horizontal</span>
                    <span className="text-white font-bold">{measurement.dx?.toFixed(1)} m</span>
                </div>
                <div className="w-px h-6 bg-slate-700"></div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 uppercase text-[10px]">Distance</span>
                    <span className="text-white font-bold">{measurement.dist?.toFixed(1)} m</span>
                </div>
                <div className="w-px h-6 bg-slate-700"></div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 uppercase text-[10px]">Angle</span>
                    <span className="text-white font-bold">{measurement.angle?.toFixed(1)} °</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default CrossSectionMeasurementTools;