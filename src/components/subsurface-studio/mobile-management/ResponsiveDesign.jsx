import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutTemplate, Laptop, Tablet, Smartphone } from 'lucide-react';

const ResponsiveDesign = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <LayoutTemplate className="w-5 h-5 mr-2 text-purple-400" /> Breakpoint Manager
                </h3>
            </div>
            <div className="space-y-3">
                {[
                    { icon: Smartphone, label: 'Mobile Portrait', width: '< 640px', active: true },
                    { icon: Smartphone, label: 'Mobile Landscape', width: '640px - 768px', active: true },
                    { icon: Tablet, label: 'Tablet', width: '768px - 1024px', active: true },
                    { icon: Laptop, label: 'Desktop', width: '> 1024px', active: true },
                ].map((bp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                        <div className="flex items-center gap-3">
                            <bp.icon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300">{bp.label}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500">{bp.width}</div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default ResponsiveDesign;