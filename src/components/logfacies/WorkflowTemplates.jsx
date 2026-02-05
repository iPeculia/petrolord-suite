import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const templates = [
    { id: 1, name: 'Clastic - Gas Bearing', desc: 'Standard workflow for sandstone reservoirs with gas effect.', tags: ['Sand', 'Gas', 'GR-Dens-Neut'] },
    { id: 2, name: 'Carbonate - Complex', desc: 'Includes PEF and multiple porosity models for limestone/dolomite.', tags: ['Carb', 'Oil', 'Complex'] },
    { id: 3, name: 'Simple Lithology', desc: 'Quick look 3-mineral model (Sand/Shale/Coal).', tags: ['Quick', 'Basic'] },
];

const WorkflowTemplates = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm">Workflow Templates</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full p-3">
                    <div className="space-y-3">
                        {templates.map(t => (
                            <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-medium text-white group-hover:text-blue-400">{t.name}</h4>
                                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{t.desc}</p>
                                <div className="flex flex-wrap gap-1">
                                    {t.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1 bg-slate-800 text-slate-400">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default WorkflowTemplates;