import React from 'react';
import { Plug, Network } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const IntegrationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Network className="w-5 h-5 text-cyan-400" /> Ecosystem Integration
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <Plug className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-white font-bold">Well Planning</h3>
                </div>
                <p className="text-sm text-slate-400">
                    Velocity models are automatically synced to the Drilling Module for pore pressure prediction and real-time depth tracking.
                </p>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <Plug className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-bold">Seismic Interpreter</h3>
                </div>
                <p className="text-sm text-slate-400">
                    Two-way sync allows you to update velocity models instantly as horizons are re-picked in the Seismic Interpretation module.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationGuide;