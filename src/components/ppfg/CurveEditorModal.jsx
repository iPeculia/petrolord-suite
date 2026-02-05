import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const CurveEditorModal = ({ isOpen, onClose, title, params, onSave }) => {
    const [localParams, setLocalParams] = React.useState(params);

    const handleChange = (key, val) => {
        setLocalParams(prev => ({ ...prev, [key]: val }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    {Object.entries(localParams).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="capitalize">{key}</span>
                                <span className="font-mono text-emerald-400">{typeof value === 'number' ? value.toExponential(2) : value}</span>
                            </div>
                            <Slider 
                                value={[value]} 
                                min={0} 
                                max={key === 'a' ? 300 : 0.001} 
                                step={key === 'a' ? 1 : 0.00001}
                                onValueChange={(v) => handleChange(key, v[0])}
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(localParams)} className="bg-emerald-600">Apply Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CurveEditorModal;