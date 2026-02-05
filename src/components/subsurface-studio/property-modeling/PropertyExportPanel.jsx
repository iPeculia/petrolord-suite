import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Box, Share2, FileJson } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PropertyExportPanel = () => {
    const { toast } = useToast();

    const handleExport = (format) => {
        toast({ title: "Export Started", description: `Exporting data as ${format}...` });
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Share2 className="w-4 h-4 mr-2 text-orange-400" /> Export Results
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('CSV')}>
                    <FileSpreadsheet className="w-3 h-3 mr-2 text-green-400" /> Volumes CSV
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('GRDECL')}>
                    <Box className="w-3 h-3 mr-2 text-blue-400" /> Grid (GRDECL)
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('PDF')}>
                    <Download className="w-3 h-3 mr-2 text-red-400" /> Report PDF
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('JSON')}>
                    <FileJson className="w-3 h-3 mr-2 text-yellow-400" /> Model JSON
                </Button>
            </CardContent>
        </Card>
    );
};

export default PropertyExportPanel;