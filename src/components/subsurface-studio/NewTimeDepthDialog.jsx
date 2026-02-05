import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Clock } from 'lucide-react';

const NewTimeDepthDialog = ({ open, onOpenChange, projectId, parentWell, onCreateComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [tdName, setTdName] = useState('');
    const [tdData, setTdData] = useState('');

    const resetState = () => {
        setIsLoading(false);
        setTdName('');
        setTdData('');
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetState();
        }
        onOpenChange(isOpen);
    };

    const handleCreateTimeDepth = async () => {
        if (!tdName || !tdData || !projectId || !parentWell || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        try {
            // Parse the pasted time-depth data (assuming TWT, TVDSS)
            const points = tdData.split('\n').map(line => {
                const [twt, tvdss] = line.split(/[\s,]+/).map(parseFloat);
                return { twt, tvdss };
            }).filter(p => !isNaN(p.twt) && !isNaN(p.tvdss));

            if (points.length === 0) {
                throw new Error("Could not parse any valid T-D points. Ensure data is in TWT, TVDSS format.");
            }

            const tdFileName = `${tdName}.json`;
            const filePath = `${user.id}/${projectId}/${parentWell.id}/${tdFileName}`;

            // Upload the JSON file to storage
            const { error: uploadError } = await supabase.storage
                .from('ss-assets')
                .upload(filePath, JSON.stringify({ points }), { 
                    contentType: 'application/json', 
                    upsert: true 
                });
                
            if (uploadError) throw uploadError;

            // Insert the asset record into the database
            const { data, error: insertError } = await supabase
                .from('ss_assets')
                .insert({
                    project_id: projectId,
                    parent_id: parentWell.id,
                    created_by: user.id,
                    name: tdName,
                    type: 'time-depth',
                    uri: filePath,
                    meta: {
                        source: 'created',
                        point_count: points.length,
                    },
                })
                .select()
                .single();
            
            if (insertError) throw insertError;

            toast({ title: 'Time-Depth Relationship Created', description: `Successfully created ${tdName}.` });
            onCreateComplete(data);
            handleOpenChange(false);
        } catch (error) {
            console.error('Time-Depth creation error:', error);
            toast({ variant: 'destructive', title: 'Failed to create Time-Depth relationship', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Time-Depth Relationship</DialogTitle>
                    <DialogDescription>Define a new T-D function for well: {parentWell?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="td-name">T-D Name</Label>
                        <Input id="td-name" value={tdName} onChange={e => setTdName(e.target.value)} placeholder="e.g., Checkshot Corrected" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="td-data">T-D Points (TWT, TVDSS)</Label>
                        <Textarea 
                            id="td-data"
                            value={tdData} 
                            onChange={e => setTdData(e.target.value)}
                            placeholder="Paste your time-depth data here. Each line should contain: Two-Way Time (ms), TVDSS (m)"
                            className="h-48 font-mono text-sm"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreateTimeDepth} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
                        Create T-D Function
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTimeDepthDialog;