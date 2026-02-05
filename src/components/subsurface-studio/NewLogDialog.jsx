import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText } from 'lucide-react';

const NewLogDialog = ({ open, onOpenChange, projectId, parentWell, onCreateComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [logName, setLogName] = useState('');
    const [unit, setUnit] = useState('');
    const [startDepth, setStartDepth] = useState('');
    const [endDepth, setEndDepth] = useState('');
    const [step, setStep] = useState('0.5');
    const [defaultValue, setDefaultValue] = useState('NaN');

    const resetState = () => {
        setIsLoading(false);
        setLogName('');
        setUnit('');
        setStartDepth('');
        setEndDepth('');
        setStep('0.5');
        setDefaultValue('NaN');
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetState();
        }
        onOpenChange(isOpen);
    };

    const handleCreateLog = async () => {
        if (!logName || !unit || !startDepth || !endDepth || !step || !defaultValue || !projectId || !parentWell || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        try {
            // Generate the log data as a CSV string
            const start = parseFloat(startDepth);
            const end = parseFloat(endDepth);
            const increment = parseFloat(step);
            const val = parseFloat(defaultValue);

            let logContent = `DEPTH,${logName}\n`;
            for (let depth = start; depth <= end; depth += increment) {
                logContent += `${depth.toFixed(4)},${val}\n`;
            }

            // Create a file from the string
            const logFile = new Blob([logContent], { type: 'text/csv' });
            const logFileName = `${logName}.csv`;
            const filePath = `${user.id}/${projectId}/${parentWell.id}/${logFileName}`;

            // Upload the file to storage
            const { error: uploadError } = await supabase.storage.from('ss-assets').upload(filePath, logFile, { upsert: true });
            if (uploadError) throw uploadError;

            // Insert the asset record into the database
            const { data, error: insertError } = await supabase
                .from('ss_assets')
                .insert({
                    project_id: projectId,
                    parent_id: parentWell.id,
                    created_by: user.id,
                    name: logName,
                    type: 'logs',
                    uri: filePath,
                    meta: {
                        source: 'created',
                        depth_unit: 'm', // Assuming meters for now, can be made dynamic
                        log_unit: unit,
                        range: { start: start, end: end, step: increment },
                        default_value: val,
                    },
                })
                .select()
                .single();
            
            if (insertError) throw insertError;

            toast({ title: 'Log Created', description: `Successfully created ${logName}.` });
            onCreateComplete(data);
            handleOpenChange(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to create log', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Well Log</DialogTitle>
                    <DialogDescription>Define the parameters for a new, empty log curve for well: {parentWell?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="log-name">Log Name</Label>
                            <Input id="log-name" value={logName} onChange={e => setLogName(e.target.value)} placeholder="e.g., GR_corr" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="log-unit">Unit</Label>
                            <Input id="log-unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g., gAPI" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-depth">Start Depth</Label>
                            <Input id="start-depth" type="number" value={startDepth} onChange={e => setStartDepth(e.target.value)} placeholder="e.g., 1000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="end-depth">End Depth</Label>
                            <Input id="end-depth" type="number" value={endDepth} onChange={e => setEndDepth(e.target.value)} placeholder="e.g., 2500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="log-step">Step</Label>
                            <Input id="log-step" type="number" value={step} onChange={e => setStep(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="default-value">Default Value</Label>
                        <Input id="default-value" value={defaultValue} onChange={e => setDefaultValue(e.target.value)} placeholder="A numeric value or NaN" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreateLog} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                        Create Log
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewLogDialog;