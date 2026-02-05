import React, { useState } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Loader2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Checkbox } from '@/components/ui/checkbox';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const NewWellDialog = ({ isOpen, onOpenChange, onWellCreated }) => {
      const { toast } = useToast();
      const { user } = useAuth();
      const [wellName, setWellName] = useState('');
      const [kbElev, setKbElev] = useState(100);
      const [addDemoData, setAddDemoData] = useState(true);
      const [loading, setLoading] = useState(false);

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!wellName) {
          toast({ title: "Well Name is required", variant: "destructive" });
          return;
        }
        if (!user) {
          toast({ title: "Authentication error", description: "You must be logged in to create a well.", variant: "destructive" });
          return;
        }

        setLoading(true);
        toast({ title: "Creating New Well...", description: "Please wait a moment." });

        try {
          const { data: orgData, error: orgError } = await supabase.rpc('get_my_organization_id');

          if (orgError || !orgData) {
            throw new Error(orgError?.message || "Could not determine your organization.");
          }
          const org_id = orgData;

          const { data: wellData, error: wellError } = await supabase
            .from('gm_wells')
            .insert({
              name: wellName,
              kb_elev_ft: kbElev,
              org_id: org_id,
            })
            .select()
            .single();
          
          if (wellError) throw wellError;

          if (addDemoData) {
            const { data: datasetData, error: datasetError } = await supabase
              .from('gm_datasets')
              .insert({
                well_id: wellData.id,
                org_id: org_id,
                name: 'Initial Log Suite',
                source: 'LAS'
              })
              .select()
              .single();
            if (datasetError) throw datasetError;

            const demoEvents = [
              { well_id: wellData.id, org_id: org_id, type: 'LOT', md_ft: 4500, tvd_ft: 4500, value: 12.5, unit: 'ppg', comment: 'Casing shoe LOT' },
              { well_id: wellData.id, org_id: org_id, type: 'MDT_PP', md_ft: 8200, tvd_ft: 8150, value: 9.8, unit: 'ppg', comment: 'Sand B pressure test' },
              { well_id: wellData.id, org_id: org_id, type: 'Kick', md_ft: 11500, tvd_ft: 11400, value: 0.5, unit: 'ppg', comment: 'Gas kick, 20 bbls influx' },
              { well_id: wellData.id, org_id: org_id, type: 'Loss', md_ft: 13200, tvd_ft: 13050, value: 50, unit: 'bbl/hr', comment: 'Partial losses in fractured limestone' },
            ];
            const { error: eventsError } = await supabase.from('gm_events').insert(demoEvents);
            if (eventsError) throw eventsError;
          }

          toast({ title: "Well Created Successfully!", description: `${wellName} is now available.` });
          onWellCreated(wellData);
          setWellName('');
          setKbElev(100);
          onOpenChange(false);

        } catch (error) {
          console.error("Error creating well:", error);
          toast({
            title: "Error Creating Well",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Well</DialogTitle>
                <DialogDescription>
                  Enter the details for your new well. You can also add demo data to get started quickly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="well-name">
                    Well Name
                  </Label>
                  <Input
                    id="well-name"
                    value={wellName}
                    onChange={(e) => setWellName(e.target.value)}
                    className="bg-slate-800"
                    placeholder="e.g., Discovery-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kb-elev">
                    KB Elevation (ft)
                  </Label>
                  <Input
                    id="kb-elev"
                    type="number"
                    value={kbElev}
                    onChange={(e) => setKbElev(parseFloat(e.target.value))}
                    className="bg-slate-800"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="add-demo-data" checked={addDemoData} onCheckedChange={setAddDemoData}/>
                    <label
                        htmlFor="add-demo-data"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                    >
                        Add demo dataset and events
                    </label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Well
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default NewWellDialog;