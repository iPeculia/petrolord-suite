import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, FileImage, FileJson, FileSpreadsheet, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const WellCorrelationExportPanel = ({ correlationContainerRef, wells, correlations, onSaveSession }) => {
    const { toast } = useToast();

    const handleExportImage = async (format = 'png') => {
        if (!correlationContainerRef.current) return;
        toast({ title: 'Generating Image...', description: 'Please wait.' });
        
        try {
            const canvas = await html2canvas(correlationContainerRef.current, {
                backgroundColor: '#0f172a', // slate-950
                scale: 2,
                useCORS: true
            });
            
            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `well-correlation-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } else if (format === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'landscape' });
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`well-correlation-${Date.now()}.pdf`);
            }
            toast({ title: 'Export Successful' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Export Failed', description: error.message });
        }
    };

    const handleExportCSV = () => {
        if (!wells || wells.length === 0) return;
        
        // Flatten data: Well, Depth, Curve Values...
        const rows = [];
        wells.forEach(w => {
            if (w.log_data) {
                // Assume unified depth index for simplicity or export key curve
                const primary = w.log_data['GR'] || [];
                primary.forEach((pt, i) => {
                    const row = { Well: w.name, Depth: pt.depth, GR: pt.value };
                    if(w.log_data['NPHI'] && w.log_data['NPHI'][i]) row.NPHI = w.log_data['NPHI'][i].value;
                    if(w.log_data['RHOB'] && w.log_data['RHOB'][i]) row.RHOB = w.log_data['RHOB'][i].value;
                    rows.push(row);
                });
            }
        });

        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'well_data_export.csv');
        toast({ title: 'CSV Exported' });
    };

    const handleExportGeoJSON = () => {
        // Export correlation lines as GeoJSON features
        // Assuming active correlations are stored in a compatible format
        // This is a placeholder implementation based on typical requirements
        const features = (correlations || []).map((c, idx) => ({
            type: "Feature",
            properties: { id: idx, type: "correlation" },
            geometry: {
                type: "LineString",
                coordinates: c.points.map(p => [0, 0]) // In real app, map screen x/y to lat/lon if available
            }
        }));
        
        const geojson = { type: "FeatureCollection", features };
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
        saveAs(blob, 'correlations.geojson');
        toast({ title: 'GeoJSON Exported' });
    };

    return (
        <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Download className="w-4 h-4 mr-2 text-green-400" /> Export & Save
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportImage('png')} className="w-full justify-start text-xs">
                    <FileImage className="w-3 h-3 mr-2 text-blue-400" /> PNG Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportImage('pdf')} className="w-full justify-start text-xs">
                    <FileImage className="w-3 h-3 mr-2 text-red-400" /> PDF Report
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="w-full justify-start text-xs">
                    <FileSpreadsheet className="w-3 h-3 mr-2 text-green-400" /> CSV Data
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportGeoJSON} className="w-full justify-start text-xs">
                    <FileJson className="w-3 h-3 mr-2 text-yellow-400" /> GeoJSON
                </Button>
                <Button size="sm" onClick={onSaveSession} className="col-span-2 mt-2 bg-cyan-600 hover:bg-cyan-700">
                    <Save className="w-3 h-3 mr-2" /> Save Session to Database
                </Button>
            </CardContent>
        </Card>
    );
};

export default WellCorrelationExportPanel;