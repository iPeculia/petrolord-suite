import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const ExpertCalibration = ({ markers, onUpdateMarkers }) => {
  const [localMarkers, setLocalMarkers] = useState(markers || []);

  const addMarker = () => {
    const newMarker = { id: Date.now(), depth: 0, type: 'LOT', value: 0, quality: 'Good' };
    setLocalMarkers([...localMarkers, newMarker]);
  };

  const updateMarker = (id, field, value) => {
    const updated = localMarkers.map(m => m.id === id ? { ...m, [field]: value } : m);
    setLocalMarkers(updated);
  };

  const deleteMarker = (id) => {
    const updated = localMarkers.filter(m => m.id !== id);
    setLocalMarkers(updated);
  };

  const handleSave = () => {
    onUpdateMarkers(localMarkers);
  };

  return (
    <div className="h-full p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
         <div>
             <h3 className="text-xl font-bold text-slate-800">Calibration Data Management</h3>
             <p className="text-slate-500 text-sm">Manage Leak-Off Tests (LOT), RFTs, and other pressure reference points.</p>
         </div>
         <Button onClick={handleSave} className="bg-emerald-600 text-white">Apply Changes</Button>
      </div>

      <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Depth (ft)</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value (ppg)</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localMarkers.map((marker) => (
                        <TableRow key={marker.id}>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    value={marker.depth} 
                                    onChange={(e) => updateMarker(marker.id, 'depth', parseFloat(e.target.value))} 
                                    className="w-32 h-8"
                                />
                            </TableCell>
                            <TableCell>
                                <Select value={marker.type} onValueChange={(v) => updateMarker(marker.id, 'type', v)}>
                                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOT">LOT</SelectItem>
                                        <SelectItem value="FIT">FIT</SelectItem>
                                        <SelectItem value="RFT">RFT</SelectItem>
                                        <SelectItem value="DST">DST</SelectItem>
                                        <SelectItem value="MDT">MDT</SelectItem>
                                        <SelectItem value="Kick">Kick</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    value={marker.value} 
                                    onChange={(e) => updateMarker(marker.id, 'value', parseFloat(e.target.value))} 
                                    className="w-32 h-8"
                                />
                            </TableCell>
                            <TableCell>
                                <Select value={marker.quality} onValueChange={(v) => updateMarker(marker.id, 'quality', v)}>
                                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Good">Good</SelectItem>
                                        <SelectItem value="Fair">Fair</SelectItem>
                                        <SelectItem value="Poor">Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => deleteMarker(marker.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4 border-t">
                <Button variant="outline" size="sm" onClick={addMarker} className="text-blue-600 border-blue-200 bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" /> Add Calibration Point
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertCalibration;