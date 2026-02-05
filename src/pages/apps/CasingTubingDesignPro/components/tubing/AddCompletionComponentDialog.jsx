import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';

const COMPONENT_TYPES = [
    "Packer", "Safety Valve (SSSV)", "Perforations", "Landing Nipple", "Flow Coupling", "Blast Joint", "Expansion Joint", "Side Pocket Mandrel", "Sliding Sleeve"
];

const AddCompletionComponentDialog = ({ open, onOpenChange, stringId }) => {
    const { setTubingStrings, addLog } = useCasingTubingDesign();
    
    const [formData, setFormData] = useState({
        type: 'Packer',
        depth: 3400,
        od: '3.5',
        id: '2.992',
        description: '',
        status: 'Active'
    });

    const handleSubmit = () => {
        if (!stringId) return;

        const newComponent = {
            id: Date.now(),
            ...formData
        };
        
        setTubingStrings(prev => prev.map(str => {
            if (str.id === stringId) {
                return {
                    ...str,
                    components: [...(str.components || []), newComponent]
                };
            }
            return str;
        }));

        addLog(`Added component: ${formData.type}`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Completion Component</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                        <Label>Component Type</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {COMPONENT_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Depth (m)</Label>
                        <Input 
                            type="number" 
                            value={formData.depth} 
                            onChange={(e) => setFormData({...formData, depth: e.target.value})}
                            className="bg-slate-900 border-slate-700" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>OD (in)</Label>
                        <Input value={formData.od} onChange={(e) => setFormData({...formData, od: e.target.value})} className="bg-slate-900 border-slate-700" />
                    </div>

                    <div className="space-y-2">
                        <Label>ID (in)</Label>
                        <Input value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} className="bg-slate-900 border-slate-700" />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="bg-slate-900 border-slate-700 h-20" 
                            placeholder="Optional details..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-lime-600 hover:bg-lime-700 text-white">
                        Add Component
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCompletionComponentDialog;