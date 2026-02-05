import React, { useState } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Layers, Grid, Trash2, Download } from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const InterpretationPanel = ({ interpretation }) => {
    const { allInterpretations, setAllInterpretations } = useStudio();
    const { toast } = useToast();
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDelete = (interp) => {
        setItemToDelete(interp);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const { error } = await supabase.from('ss_interpretations').update({ deleted_at: new Date().toISOString() }).eq('id', itemToDelete.id);
        if (error) {
            toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
        } else {
            setAllInterpretations(prev => prev.filter(i => i.id !== itemToDelete.id));
            toast({ title: 'Deleted successfully' });
        }
        setItemToDelete(null);
    };

    const exportToGeoJSON = (interp) => {
        const geojsonString = JSON.stringify(interp.geojson, null, 2);
        const blob = new Blob([geojsonString], { type: 'application/json' });
        saveAs(blob, `${interp.name}.geojson`);
    };

    const exportToCSV = (interp) => {
        if (!interp.geojson?.geometry?.coordinates) {
            toast({ variant: 'destructive', title: 'No coordinates to export' });
            return;
        }
        const coords = interp.geojson.geometry.coordinates;
        const is3D = coords[0] && coords[0].length === 3;
        const headers = is3D ? ['x', 'y', 'z'] : ['x', 'y'];
        const data = coords.map(c => is3D ? { x: c[0], y: c[1], z: c[2] } : { x: c[0], y: c[1] });
        
        const csv = Papa.unparse({ fields: headers, data });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${interp.name}.csv`);
    };

    const renderInterpretationItem = (interp) => (
        <div key={interp.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-700/50">
            <div className="flex items-center truncate">
                {interp.kind === 'horizon' ? <Layers className="w-4 h-4 mr-2 text-cyan-400" /> : <Grid className="w-4 h-4 mr-2 text-amber-400" />}
                <span className="text-sm truncate">{interp.name}</span>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportToGeoJSON(interp)}><Download className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(interp)}><Trash2 className="w-4 h-4" /></Button>
            </div>
        </div>
    );

    const horizons = allInterpretations.filter(i => i.kind === 'horizon');
    const faults = allInterpretations.filter(i => i.kind === 'fault');

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Interpretation Details</CardTitle>
                    <CardDescription>Properties of the selected interpretation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p><span className="font-semibold">Name:</span> {interpretation.name}</p>
                    <p><span className="font-semibold">Type:</span> {interpretation.kind}</p>
                    <p><span className="font-semibold">ID:</span> <span className="text-xs text-slate-400">{interpretation.id}</span></p>
                    <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => exportToGeoJSON(interpretation)}><Download className="w-4 h-4 mr-2" /> GeoJSON</Button>
                        <Button size="sm" variant="secondary" onClick={() => exportToCSV(interpretation)}><Download className="w-4 h-4 mr-2" /> CSV</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Project Interpretations</CardTitle>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold text-cyan-300 mb-2">Horizons</h4>
                    <ScrollArea className="h-40 border border-slate-700 rounded-md p-1">
                        {horizons.length > 0 ? horizons.map(renderInterpretationItem) : <p className="p-4 text-center text-slate-500">No horizons.</p>}
                    </ScrollArea>

                    <h4 className="font-semibold text-amber-300 mt-4 mb-2">Faults</h4>
                    <ScrollArea className="h-40 border border-slate-700 rounded-md p-1">
                        {faults.length > 0 ? faults.map(renderInterpretationItem) : <p className="p-4 text-center text-slate-500">No faults.</p>}
                    </ScrollArea>
                </CardContent>
            </Card>

            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will delete the interpretation '{itemToDelete?.name}'. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default InterpretationPanel;