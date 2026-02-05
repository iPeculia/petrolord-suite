import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Box, Plus, Edit2 } from 'lucide-react';

const PropertyBuilder = () => {
  const properties = [
    { id: 1, name: 'Porosity', symbol: 'PHI', type: 'Continuous', unit: 'v/v', min: 0, max: 0.35 },
    { id: 2, name: 'Permeability', symbol: 'K', type: 'Continuous', unit: 'mD', min: 0.01, max: 5000, log: true },
    { id: 3, name: 'Water Saturation', symbol: 'Sw', type: 'Continuous', unit: 'v/v', min: 0, max: 1 },
    { id: 4, name: 'Net-to-Gross', symbol: 'NTG', type: 'Continuous', unit: '-', min: 0, max: 1 },
  ];

  return (
    <Card className="h-full bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Property Definitions</CardTitle>
            <CardDescription>Manage petrophysical properties for modeling</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="border-slate-700">
            <Plus className="w-4 h-4 mr-2" /> Add Property
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {properties.map((prop) => (
            <div key={prop.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">{prop.name} ({prop.symbol})</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] bg-slate-800">{prop.type}</Badge>
                    <span className="text-xs text-slate-500">
                      Range: {prop.min} - {prop.max} {prop.unit}
                    </span>
                    {prop.log && <Badge variant="outline" className="text-[10px] border-slate-700">Log Scale</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBuilder;