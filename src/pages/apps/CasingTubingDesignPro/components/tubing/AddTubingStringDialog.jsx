import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { TUBING_SIZES, CASING_GRADES, CONNECTIONS } from '../../data/catalog';

const AddTubingStringDialog = ({ open, onOpenChange }) => {
    const { setTubingStrings, addLog } = useCasingTubingDesign();
    
    const [formData, setFormData] = useState({
        name: 'New Tubing String',
        top_depth: 0,
        bottom_depth: 3500,
        od: '3.5',
        weight: 9.3,
        grade: 'L-80',
        connection: 'VAM Top',
        status: 'Active'
    });

    const handleSubmit = () => {
        const newString = {
            id: Date.now(),
            ...formData,
            sections: [{
                id: `sec-${Date.now()}`,
                name: `${formData.name} - Sec 1`,
                top_depth: formData.top_depth,
                bottom_depth: formData.bottom_depth,
                od: formData.od,
                id_nom: (parseFloat(formData.od) * 0.88).toFixed(3), // Mock ID
                weight: formData.weight,
                grade: formData.grade,
                api_burst: 10500, 
                api_collapse: 9500,
                yield_strength: 150000 
            }],
            components: [] // Empty components list
        };
        
        setTubingStrings(prev => [...prev, newString]);
        addLog(`Added new tubing string: ${formData.name}`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Tubing String</DialogTitle>
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
                                {TUBING_SIZES.map(s => (
                                    <SelectItem key={s.od} value={s.od.toString()}>{s.od}"</SelectItem>
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
                        Save Tubing
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddTubingStringDialog;