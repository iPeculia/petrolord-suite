import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HandMetal, Fingerprint } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const TouchInteractions = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <HandMetal className="w-5 h-5 mr-2 text-orange-400" /> Gesture Controls
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0 divide-y divide-slate-800">
                {[
                    { name: 'Double Tap to Zoom', desc: 'Map & Seismic Views', enabled: true },
                    { name: 'Long Press Context Menu', desc: 'Project Tree & Lists', enabled: true },
                    { name: 'Swipe Actions', desc: 'List items (Delete/Archive)', enabled: true },
                    { name: 'Pinch to Scale', desc: 'Graphs & logs', enabled: true },
                ].map((g, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-900/50">
                        <div>
                            <div className="text-sm font-bold text-slate-200">{g.name}</div>
                            <div className="text-xs text-slate-500">{g.desc}</div>
                        </div>
                        <Switch checked={g.enabled} />
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default TouchInteractions;