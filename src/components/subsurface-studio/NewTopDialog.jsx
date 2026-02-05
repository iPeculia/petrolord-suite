import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Milestone } from 'lucide-react';

const NewTopDialog = ({ open, onOpenChange, projectId, parentWell, onCreateComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [topName, setTopName] = useState('');
    const [md, setMd] = useState('');
    const [tvd, setTvd] = useState('');

    const resetState = () => {
        setIsLoading(false);
        setTopName('');
        setMd('');
        setTvd('');
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetState();
        }
        onOpenChange(isOpen);
    };

    const handleCreateTop = async () => {
        if (!topName || !md || !tvd || !projectId || !parentWell || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('ss_assets')
                .insert({
                    project_id: projectId,
                    parent_id: parentWell.id,
                    created_by: user.id,
                    name: topName,
                    type: 'tops',
                    meta: {
                        source: 'created',
                        md: parseFloat(md),
                        tvd: parseFloat(tvd),
                        depth_unit: 'm' // Assuming meters, can be made dynamic later
                    },
                })
                .select()
                .single();
            
            if (error) throw error;

            toast({ title: 'Top Created', description: `Successfully created top marker ${topName}.` });
            onCreateComplete(data);
            handleOpenChange(false);

        } catch (error) {
            console.error('Top creation error:', error);
            toast({ variant: 'destructive', title: 'Failed to create top', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Well Top</DialogTitle>
                    <DialogDescription>Define a new top marker for well: {parentWell?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="top-name">Top Name</Label>
                        <Input id="top-name" value={topName} onChange={e => setTopName(e.target.value)} placeholder="e.g., Top Nansen Formation" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="top-md">Measured Depth (MD)</Label>
                            <Input id="top-md" type="number" value={md} onChange={e => setMd(e.target.value)} placeholder="e.g., 2150.5" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="top-tvd">True Vertical Depth (TVD)</Label>
                            <Input id="top-tvd" type="number" value={tvd} onChange={e => setTvd(e.target.value)} placeholder="e.g., 2145.2" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreateTop} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Milestone className="w-4 h-4 mr-2" />}
                        Create Top
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTopDialog;