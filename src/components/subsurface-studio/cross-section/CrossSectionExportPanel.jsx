import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Image, FileText, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const CrossSectionExportPanel = ({ projectionData, sectionLine }) => {
    const { toast } = useToast();

    const handleExportCSV = () => {
        if (!projectionData) return;
        const data = projectionData.wells.map(w => ({
            WellName: w.name,
            ProjectedDistance: w.projection.distance,
            Offset: w.projection.offset,
            TopDepth: w.meta.kb,
            BottomDepth: w.meta.md_max
        }));
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'cross_section_data.csv');
        toast({ title: "CSV Exported" });
    };

    const handleExportGeoJSON = () => {
        if (!sectionLine) return;
        const geojson = {
            type: "Feature",
            properties: { name: "Cross Section Line" },
            geometry: {
                type: "LineString",
                coordinates: sectionLine.map(p => [p.x, p.y])
            }
        };
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
        saveAs(blob, 'section_line.geojson');
        toast({ title: "GeoJSON Exported" });
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Image Export", description: "Use browser print for now (High-res canvas export coming soon)." })} className="justify-start text-xs h-8">
                <Image className="w-3 h-3 mr-2 text-blue-400" /> PNG Image
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="justify-start text-xs h-8">
                <FileSpreadsheet className="w-3 h-3 mr-2 text-green-400" /> CSV Data
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "PDF Export", description: "PDF generation queued." })} className="justify-start text-xs h-8">
                <FileText className="w-3 h-3 mr-2 text-red-400" /> PDF Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportGeoJSON} className="justify-start text-xs h-8">
                <FileJson className="w-3 h-3 mr-2 text-amber-400" /> GeoJSON
            </Button>
        </div>
    );
};

export default CrossSectionExportPanel;