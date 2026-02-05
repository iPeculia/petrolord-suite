import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileOutput, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PetrelKingdomExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-200">
            <FileOutput className="w-4 h-4" /> External Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
            <Select defaultValue="petrel">
                <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700 w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="petrel">Petrel (ASCII)</SelectItem>
                    <SelectItem value="kingdom">Kingdom (T-D Chart)</SelectItem>
                    <SelectItem value="segy">SEG-Y Velocity Volume</SelectItem>
                </SelectContent>
            </Select>
            <Button size="sm" className="h-8 bg-slate-800 hover:bg-slate-700 border border-slate-600">
                <Download className="w-3 h-3" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetrelKingdomExporter;