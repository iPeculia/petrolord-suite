import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileImage, Box, Database, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StructuralFrameworkExportPanel = () => {
    const { toast } = useToast();

    const handleExport = (format) => {
        toast({ title: "Export Started", description: `Exporting model as ${format}...` });
        // Implement actual export logic here
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Share2 className="w-4 h-4 mr-2 text-blue-400" /> Export Model
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('RESQML')}>
                    <Box className="w-3 h-3 mr-2 text-orange-400" /> RESQML
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('GRDECL')}>
                    <Database className="w-3 h-3 mr-2 text-green-400" /> GRDECL
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('OBJ')}>
                    <Box className="w-3 h-3 mr-2 text-blue-400" /> Wavefront OBJ
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => handleExport('PNG')}>
                    <FileImage className="w-3 h-3 mr-2 text-purple-400" /> High-Res PNG
                </Button>
                <Button className="col-span-2 mt-2 bg-blue-600 hover:bg-blue-700" size="sm" onClick={() => handleExport('Native')}>
                    <Download className="w-3 h-3 mr-2" /> Save Project
                </Button>
            </CardContent>
        </Card>
    );
};

export default StructuralFrameworkExportPanel;