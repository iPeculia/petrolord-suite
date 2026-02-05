import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, LineChart } from 'lucide-react';

const NewSurveyDialog = ({ open, onOpenChange, projectId, parentWell, onCreateComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [surveyName, setSurveyName] = useState('');
    const [surveyData, setSurveyData] = useState('');

    const resetState = () => {
        setIsLoading(false);
        setSurveyName('');
        setSurveyData('');
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetState();
        }
        onOpenChange(isOpen);
    };

    const handleCreateSurvey = async () => {
        if (!surveyName || !surveyData || !projectId || !parentWell || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        try {
            // Parse the pasted survey data (assuming MD, INC, AZ)
            const stations = surveyData.split('\n').map(line => {
                const [md, inc, az] = line.split(/[\s,]+/).map(parseFloat);
                return { md, inc, az };
            }).filter(s => !isNaN(s.md) && !isNaN(s.inc) && !isNaN(s.az));

            if (stations.length === 0) {
                throw new Error("Could not parse any valid survey stations. Ensure data is in MD, INC, AZ format.");
            }

            const surveyFileName = `${surveyName}.json`;
            const filePath = `${user.id}/${projectId}/${parentWell.id}/${surveyFileName}`;

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
                    name: surveyName,
                    type: 'survey',
                    uri: filePath,
                    meta: {
                        source: 'created',
                        station_count: stations.length,
                    },
                })
                .select()
                .single();
            
            if (insertError) throw insertError;

            toast({ title: 'Survey Created', description: `Successfully created ${surveyName}.` });
            onCreateComplete(data);
            handleOpenChange(false);
        } catch (error) {
            console.error('Survey creation error:', error);
            toast({ variant: 'destructive', title: 'Failed to create survey', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Well Survey</DialogTitle>
                    <DialogDescription>Define a new directional survey for well: {parentWell?.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="survey-name">Survey Name</Label>
                        <Input id="survey-name" value={surveyName} onChange={e => setSurveyName(e.target.value)} placeholder="e.g., Definitive Survey" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="survey-data">Survey Stations (MD, INC, AZ)</Label>
                        <Textarea 
                            id="survey-data"
                            value={surveyData} 
                            onChange={e => setSurveyData(e.target.value)}
                            placeholder="Paste your survey data here. Each line should contain: Measured Depth, Inclination, Azimuth"
                            className="h-48 font-mono text-sm"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreateSurvey} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LineChart className="w-4 h-4 mr-2" />}
                        Create Survey
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewSurveyDialog;