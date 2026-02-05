import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Upload } from 'lucide-react';

const VolumetricsExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg border border-emerald-800">
                    <Box className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Volumetrics (GRV)</div>
                    <div className="text-xs text-slate-500">Export Low/Base/High Depth Maps</div>
                </div>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <Upload className="w-3 h-3 mr-2" /> Export
            </Button>
        </CardContent>
    </Card>
  );
};

export default VolumetricsExporter;