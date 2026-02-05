import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Milestone } from 'lucide-react'; // Using Milestone for now, can be changed if a better icon is found for trajectory

const NewTrajectoryDialog = ({ open, onOpenChange, projectId, parentWell, onCreateComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [trajectoryName, setTrajectoryName] = useState('');
    const [trajectoryData, setTrajectoryData] = useState('');

    const resetState = () => {
        setIsLoading(false);
        setTrajectoryName('');
        setTrajectoryData('');
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetState();
        }
        onOpenChange(isOpen);
    };

    const handleCreateTrajectory = async () => {
        if (!trajectoryName || !trajectoryData || !projectId || !parentWell || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        try {
            // Parse the pasted trajectory data (assuming MD, INC, AZ)
            const stations = trajectoryData.split('\n').map(line => {
                const [md, inc, az] = line.split(/[\s,]+/).map(parseFloat);
                return { md, inc, az };
            }).filter(s => !isNaN(s.md) && !isNaN(s.inc) && !isNaN(s.az));

            if (stations.length === 0) {
                throw new Error("Could not parse any valid trajectory stations. Ensure data is in MD, INC, AZ format.");
            }

            const trajectoryFileName = `${trajectoryName}.json`;
            const filePath = `${user.id}/${projectId}/${parentWell.id}/${trajectoryFileName}`;

            // Upload the JSON file to storage
            const { error: uploadError } = await supabase.storage
                .from('ss-assets')
                .upload(filePath, JSON.stringify({ stations }), { 
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
                    name: trajectoryName,
                    type: 'trajectory',
                    uri: filePath,
                    meta: {
                        source: 'created',
                        station_count: stations.length,
                    },
                })
                .select()
                .single();
            
            if (insertError) throw insertError;

            toast({ title: 'Trajectory Created', description: `Successfully created ${trajectoryName}.` });
            onCreateComplete(data);
            handleOpenChange(false);
        } catch (error) {
            console.error('Trajectory creation error:', error);
            toast({ variant: 'destructive', title: 'Failed to create trajectory', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Well Trajectory</DialogTitle>
                    <DialogDescription>Define a new trajectory for well: {parentWell?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="trajectory-name">Trajectory Name</Label>
                        <Input id="trajectory-name" value={trajectoryName} onChange={e => setTrajectoryName(e.target.value)} placeholder="e.g., Planned Trajectory 1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trajectory-data">Trajectory Stations (MD, INC, AZ)</Label>
                        <Textarea 
                            id="trajectory-data"
                            value={trajectoryData} 
                            onChange={e => setTrajectoryData(e.target.value)}
                            placeholder="Paste your trajectory data here. Each line should contain: Measured Depth, Inclination, Azimuth"
                            className="h-48 font-mono text-sm"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreateTrajectory} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Milestone className="w-4 h-4 mr-2" />}
                        Create Trajectory
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTrajectoryDialog;