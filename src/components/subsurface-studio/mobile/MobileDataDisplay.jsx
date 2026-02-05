import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MobileDataCard = ({ title, subtitle, status, dataPoints = [] }) => (
    <Card className="bg-slate-900 border-slate-800 mb-2">
        <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="font-bold text-sm text-slate-200">{title}</div>
                    <div className="text-xs text-slate-500">{subtitle}</div>
                </div>
                {status && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                        {status}
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                {dataPoints.map((pt, i) => (
                    <div key={i} className="flex flex-col bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px]">{pt.label}</span>
                        <span className="text-slate-200 font-mono">{pt.value}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export const MobileListView = ({ items, renderItem }) => (
    <ScrollArea className="h-full w-full bg-slate-950">
        <div className="p-2 pb-20"> {/* Padding for bottom nav */}
            {items.map(renderItem)}
        </div>
    </ScrollArea>
);