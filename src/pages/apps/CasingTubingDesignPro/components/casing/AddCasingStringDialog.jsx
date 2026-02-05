import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { CASING_GRADES, CONNECTIONS } from '../../data/catalog';

const AddCasingStringDialog = ({ open, onOpenChange }) => {
    const { setCasingStrings, addLog } = useCasingTubingDesign();
    
    const [formData, setFormData] = useState({
        name: 'Production Casing',
        top_depth: 0,
        bottom_depth: 3500,
        od: '9.625',
        weight: 47,
        grade: 'P-110',
        connection: 'BTC',
        status: 'Active'
    });

    const handleSubmit = () => {
        const newString = {
            id: Date.now(),
            ...formData,
            // Create a default section matching the string properties for Phase 3 simplification
            sections: [{
                id: `sec-${Date.now()}`,
                name: `${formData.name} - Sec 1`,
                top_depth: formData.top_depth,
                bottom_depth: formData.bottom_depth,
                od: formData.od,
                weight: formData.weight,
                grade: formData.grade,
                api_burst: 8500, // Mock value from catalog
                api_collapse: 6500, // Mock value from catalog
                yield_strength: 110000 * 10 // Approx lbs based on grade
            }]
        };
        
        setCasingStrings(prev => [...prev, newString]);
        addLog(`Added new casing string: ${formData.name}`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Casing String</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                        <Label>String Name</Label>
                        <Input 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-slate-900 border-slate-700" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Top Depth (m)</Label>
                        <Input 
                            type="number" 
                            value={formData.top_depth} 
                            onChange={(e) => setFormData({...formData, top_depth: e.target.value})}
                            className="bg-slate-900 border-slate-700" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Bottom Depth (m)</Label>
                        <Input 
                            type="number" 
                            value={formData.bottom_depth} 
                            onChange={(e) => setFormData({...formData, bottom_depth: e.target.value})}
                            className="bg-slate-900 border-slate-700" 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>OD (in)</Label>
                        <Select value={formData.od} onValueChange={(v) => setFormData({...formData, od: v})}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {[20, 13.375, 9.625, 7, 5.5, 4.5].map(od => (
                                    <SelectItem key={od} value={od.toString()}>{od}"</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Weight (kg/m)</Label>
                        <Input 
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            className="bg-slate-900 border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Grade</Label>
                        <Select value={formData.grade} onValueChange={(v) => setFormData({...formData, grade: v})}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {CASING_GRADES.map(g => (
                                    <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Connection</Label>
                        <Select value={formData.connection} onValueChange={(v) => setFormData({...formData, connection: v})}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {CONNECTIONS.map(c => (
                                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-lime-600 hover:bg-lime-700 text-white">
                        Save String
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCasingStringDialog;