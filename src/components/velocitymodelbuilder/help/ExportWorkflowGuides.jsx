import React from 'react';
import { FileOutput } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ExportWorkflowGuides = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <FileOutput className="w-5 h-5 text-orange-400" /> Export Workflows
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
                <h3 className="text-white font-bold mb-2">To Petrel / Eclipse</h3>
                <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
                    <li>Go to Export Tab</li>
                    <li>Select "ZMap+ Grid" or "Eclipse ASCII"</li>
                    <li>Choose domain (Depth, Vint, Vavg)</li>
                    <li>Click "Batch Export"</li>
                </ol>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
                <h3 className="text-white font-bold mb-2">To Python / Pandas</h3>
                <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
                    <li>Select "JSON API" format</li>
                    <li>Copy the generated API Endpoint</li>
                    <li>Use the Python SDK snippet provided</li>
                </ol>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportWorkflowGuides;