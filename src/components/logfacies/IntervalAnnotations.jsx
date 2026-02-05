import React from 'react';
import { Flag, MessageSquare, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const annotations = [
    { id: 1, depth: '1255.0', type: 'flag', text: 'Possible Core Point', user: 'Geo_01' },
    { id: 2, depth: '1340.5', type: 'note', text: 'Facies change confirmed by cuttings', user: 'Drilling_Eng' },
];

const IntervalAnnotations = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Annotations</CardTitle>
                <Button size="xs" variant="ghost" className="h-6"><Plus className="w-3 h-3"/></Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[250px] p-3">
                    <div className="space-y-3">
                        {annotations.map(a => (
                            <div key={a.id} className="flex gap-3 p-2 bg-slate-950 rounded border border-slate-800 text-sm">
                                <div className="mt-1">
                                    {a.type === 'flag' ? <Flag className="w-4 h-4 text-red-400"/> : <MessageSquare className="w-4 h-4 text-blue-400"/>}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-slate-300 bg-slate-800 px-1 rounded">{a.depth}m</span>
                                        <span className="text-[10px] text-slate-500">{a.user}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed">{a.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default IntervalAnnotations;