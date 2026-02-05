import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PetrophysicalProperties = ({ onBack }) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState([
    { id: 1, name: 'Effective Porosity', symbol: 'PHIE', unit: 'v/v', min: 0, max: 0.4 },
    { id: 2, name: 'Water Saturation', symbol: 'Sw', unit: 'v/v', min: 0, max: 1 },
    { id: 3, name: 'Permeability', symbol: 'K', unit: 'mD', min: 0.01, max: 5000 },
  ]);

  const handleSave = () => {
    toast({ title: "Properties Saved", description: "Petrophysical model updated." });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">Property Definition</h2>
            <p className="text-slate-400 text-sm">Define curves and limits for petrophysical modeling.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500">
          <Save className="w-4 h-4 mr-2" /> Save Model
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 flex-1 overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Active Properties</CardTitle>
          <Button variant="outline" size="sm" className="border-slate-700">
            <Plus className="w-4 h-4 mr-2" /> Add Property
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Symbol</TableHead>
                <TableHead className="text-slate-400">Unit</TableHead>
                <TableHead className="text-slate-400">Min Limit</TableHead>
                <TableHead className="text-slate-400">Max Limit</TableHead>
                <TableHead className="text-slate-400 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-200">{prop.name}</TableCell>
                  <TableCell className="text-slate-400 font-mono">{prop.symbol}</TableCell>
                  <TableCell className="text-slate-400">{prop.unit}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={prop.min} 
                      className="h-8 w-24 bg-slate-950 border-slate-700" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={prop.max} 
                      className="h-8 w-24 bg-slate-950 border-slate-700" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetrophysicalProperties;