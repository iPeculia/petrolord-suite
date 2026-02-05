import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FaciesBuilder = () => {
  const { toast } = useToast();
  const [faciesList, setFaciesList] = useState([
    { id: 1, name: 'Clean Sand', code: 1, color: '#F4A460', probability: 0.3 },
    { id: 2, name: 'Shaly Sand', code: 2, color: '#BDB76B', probability: 0.2 },
    { id: 3, name: 'Shale', code: 3, color: '#708090', probability: 0.5 },
  ]);

  const handleAddFacies = () => {
    const newId = faciesList.length + 1;
    setFaciesList([...faciesList, { id: newId, name: 'New Facies', code: newId, color: '#CCCCCC', probability: 0.0 }]);
  };

  const handleDelete = (id) => {
    setFaciesList(faciesList.filter(f => f.id !== id));
  };

  const handleSave = () => {
    toast({ title: "Facies Model Saved", description: "Facies definitions updated successfully." });
  };

  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Facies Definitions</CardTitle>
            <CardDescription>Define lithofacies types and properties</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-700" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400">Code</TableHead>
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Color</TableHead>
              <TableHead className="text-slate-400">Global Prob.</TableHead>
              <TableHead className="text-slate-400 w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faciesList.map((facies) => (
              <TableRow key={facies.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-mono text-slate-300">{facies.code}</TableCell>
                <TableCell>
                  <Input 
                    value={facies.name} 
                    onChange={(e) => {
                      const updated = faciesList.map(f => f.id === facies.id ? {...f, name: e.target.value} : f);
                      setFaciesList(updated);
                    }}
                    className="h-8 bg-slate-950 border-slate-700" 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={facies.color} 
                      onChange={(e) => {
                        const updated = faciesList.map(f => f.id === facies.id ? {...f, color: e.target.value} : f);
                        setFaciesList(updated);
                      }}
                      className="w-8 h-8 bg-transparent border-none cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-mono">{facies.color}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={facies.probability} 
                    onChange={(e) => {
                      const updated = faciesList.map(f => f.id === facies.id ? {...f, probability: parseFloat(e.target.value)} : f);
                      setFaciesList(updated);
                    }}
                    className="h-8 bg-slate-950 border-slate-700 w-24" 
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(facies.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleAddFacies} className="w-full mt-4 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-400">
          <Plus className="w-4 h-4 mr-2" /> Add Facies
        </Button>
      </CardContent>
    </Card>
  );
};

export default FaciesBuilder;