import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, FileImage, FileJson, FileSpreadsheet, Save, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useStudio } from '@/contexts/StudioContext';

const SeismicExportPanel = ({ onSaveSession, currentSessionData }) => {
    const { toast } = useToast();
    const { activeProject } = useStudio();

    const handleSaveToDatabase = async () => {
        if (!onSaveSession) return;
        await onSaveSession();
    };

    const handleExportGeoJSON = () => {
        // Logic to bundle picks into GeoJSON and trigger download
        const picks = currentSessionData?.currentPicks || [];
        const geojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: picks.map(p => [p.x, p.y]) // simplified coordinate mapping
                    },
                    properties: {
                        name: "Seismic Pick Export",
                        date: new Date().toISOString()
                    }
                }
            ]
        };
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seismic_interpretation.geojson';
        a.click();
        toast({ title: "Exported", description: "GeoJSON downloaded." });
    };

    const handleExportImage = () => {
        const canvas = document.querySelector('canvas'); // Naive selector, refine if multiple canvases
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = 'seismic_snapshot.png';
            a.click();
            toast({ title: "Snapshot Saved", description: "Image downloaded." });
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 p-3">
                <CardTitle className="text-xs font-bold flex items-center text-slate-400 uppercase">
                    <Download className="w-3 h-3 mr-2" /> Export & Save
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
                <Button size="sm" onClick={handleSaveToDatabase} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    <Save className="w-3 h-3 mr-2" /> Save Session to Cloud
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportImage} className="w-full justify-start text-xs h-8">
                        <FileImage className="w-3 h-3 mr-2 text-blue-400" /> PNG Image
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportGeoJSON} className="w-full justify-start text-xs h-8">
                        <FileJson className="w-3 h-3 mr-2 text-yellow-400" /> GeoJSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast({title:"Coming Soon"})} className="w-full justify-start text-xs h-8">
                        <FileSpreadsheet className="w-3 h-3 mr-2 text-green-400" /> CSV Data
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast({title:"Coming Soon"})} className="w-full justify-start text-xs h-8">
                        <Share2 className="w-3 h-3 mr-2 text-purple-400" /> Struct. Fwk
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SeismicExportPanel;