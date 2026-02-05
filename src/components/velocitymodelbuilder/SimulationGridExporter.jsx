import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid, Server } from 'lucide-react';

const SimulationGridExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-400">
            <Grid className="w-4 h-4" /> Eclipse/Sim Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-[10px] text-slate-500 mb-2">
            Export corner-point geometry depth corrections or layer thickness multipliers (MULTZ).
        </p>
        <Button size="sm" className="w-full h-8 bg-amber-900/20 hover:bg-amber-900/30 text-amber-400 border border-amber-800/50">
            <Server className="w-3 h-3 mr-2" /> Export .GRDECL
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulationGridExporter;