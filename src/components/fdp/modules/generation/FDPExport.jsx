import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, FileSpreadsheet, FileCode, Download, Printer } from 'lucide-react';
import { FDPExportService } from '@/services/fdp/FDPExportService';
import { useToast } from '@/components/ui/use-toast';

const ExportOption = ({ title, icon: Icon, description, onClick, loading }) => (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer transition-all hover:bg-slate-800/80" onClick={onClick}>
        <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-slate-900 mb-4">
                {loading ? <div className="animate-spin w-6 h-6 border-2 border-slate-500 border-t-white rounded-full" /> : <Icon className="w-6 h-6 text-blue-400" />}
            </div>
            <h3 className="font-bold text-white mb-1">{title}</h3>
            <p className="text-xs text-slate-400">{description}</p>
        </CardContent>
    </Card>
);

const FDPExport = ({ state }) => {
    const { toast } = useToast();
    const [generating, setGenerating] = useState(false);

    const handlePDFExport = async () => {
        setGenerating(true);
        try {
            const doc = await FDPExportService.generatePDF(state, { version: '1.0' });
            doc.save(`FDP_${state.fieldData?.fieldName || 'Project'}.pdf`);
            toast({ title: "Export Complete", description: "FDP PDF document downloaded successfully." });
        } catch (e) {
            console.error(e);
            toast({ title: "Export Failed", description: "Could not generate PDF.", variant: "destructive" });
        } finally {
            setGenerating(false);
        }
    };

    const handleMockExport = (format) => {
        toast({ title: "Export Started", description: `Generating ${format} file... (Simulation)` });
        setTimeout(() => {
            toast({ title: "Export Complete", description: `${format} file downloaded.` });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ExportOption 
                    title="Full PDF Report" 
                    icon={FileText} 
                    description="Complete FDP document with all sections and tables."
                    onClick={handlePDFExport}
                    loading={generating}
                />
                <ExportOption 
                    title="Executive Summary" 
                    icon={Printer} 
                    description="Compact 5-page summary for management review."
                    onClick={handlePDFExport} // Reusing for demo
                />
                <ExportOption 
                    title="Excel Data Pack" 
                    icon={FileSpreadsheet} 
                    description="Raw data tables for drilling, costs, and economics."
                    onClick={() => handleMockExport("Excel")}
                />
                <ExportOption 
                    title="JSON Data Model" 
                    icon={FileCode} 
                    description="Machine-readable export for system integration."
                    onClick={() => handleMockExport("JSON")}
                />
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium">Share Live Link</h4>
                            <p className="text-sm text-slate-400">Give read-only access to stakeholders.</p>
                        </div>
                        <Button variant="outline" className="border-slate-700 text-slate-300">
                            Generate Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FDPExport;