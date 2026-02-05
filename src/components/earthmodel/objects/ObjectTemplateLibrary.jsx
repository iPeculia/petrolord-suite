import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Copy, Grid, MoreHorizontal } from 'lucide-react';

const ObjectTemplateLibrary = ({ onBack }) => {
  const templates = [
    { name: 'Meandering Channel (High Sinuosity)', type: 'Channel', description: 'Typical for low-gradient fluvial systems.' },
    { name: 'Braided Channel', type: 'Channel', description: 'Multi-thread channels with high net-to-gross.' },
    { name: 'Turbidite Lobe (Sheet)', type: 'Lobe', description: 'Distal basin floor fan sheet sands.' },
    { name: 'Carbonate Reef Build-up', type: 'Mound', description: 'Isolated platform carbonate build-up.' },
    { name: 'Levee-Overbank Complex', type: 'Complex', description: 'Channel with associated levee deposits.' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Grid className="w-6 h-6 text-blue-400" />
              Template Library
            </h2>
            <p className="text-slate-400 text-sm">Pre-defined geological object templates.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                        <span className="text-xs font-mono text-blue-400 uppercase">{tpl.type}</span>
                        <CardTitle className="text-white text-base mt-1">{tpl.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-4">{tpl.description}</p>
                    <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Copy className="w-3 h-3 mr-2" /> Use Template
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default ObjectTemplateLibrary;