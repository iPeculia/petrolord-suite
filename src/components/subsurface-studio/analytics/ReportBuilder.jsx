import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Layout, BarChart2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';

const ReportBuilder = () => {
    const { toast } = useToast();
    const [config, setConfig] = useState({
        type: 'summary',
        includeCharts: true,
        includeTables: true,
        includeMap: false,
        format: 'pdf'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (config.format === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("EarthModel Studio Report", 20, 20);
            doc.setFontSize(12);
            doc.text(`Type: ${config.type.toUpperCase()}`, 20, 35);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
            doc.text("------------------------------------------------", 20, 50);
            doc.text("This is a placeholder for generated report content.", 20, 60);
            doc.save(`ems_report_${Date.now()}.pdf`);
        }
        
        setIsGenerating(false);
        toast({ title: "Report Generated", description: "Your report has been downloaded successfully." });
    };

    return (
        <div className="h-full p-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950">
            <Card className="bg-slate-900 border-slate-800 md:col-span-1">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><Layout className="w-4 h-4 mr-2 text-cyan-400"/> Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Report Type</Label>
                        <Select value={config.type} onValueChange={v => setConfig({...config, type: v})}>
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="summary">Executive Summary</SelectItem>
                                <SelectItem value="technical">Technical Detail</SelectItem>
                                <SelectItem value="audit">Data Audit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-slate-400">Content Sections</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="chk-charts" checked={config.includeCharts} onCheckedChange={c => setConfig({...config, includeCharts: c})} />
                            <Label htmlFor="chk-charts" className="text-xs">Analytics Charts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="chk-tables" checked={config.includeTables} onCheckedChange={c => setConfig({...config, includeTables: c})} />
                            <Label htmlFor="chk-tables" className="text-xs">Data Tables</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="chk-map" checked={config.includeMap} onCheckedChange={c => setConfig({...config, includeMap: c})} />
                            <Label htmlFor="chk-map" className="text-xs">Map Snapshots</Label>
                        </div>
                    </div>

                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isGenerating ? "Compiling..." : "Generate Report"}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 md:col-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><FileText className="w-4 h-4 mr-2 text-slate-400"/> Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow bg-white m-4 rounded shadow-inner p-8 text-black min-h-[400px] font-serif">
                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                        <h1 className="text-3xl font-bold">EarthModel Studio</h1>
                        <h2 className="text-xl text-slate-600 uppercase tracking-widest mt-2">{config.type} Report</h2>
                        <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold border-b border-slate-300 pb-1">1. Executive Summary</h3>
                        <p className="text-sm leading-relaxed text-slate-800">
                            This report provides a comprehensive analysis of the current subsurface project data. 
                            Key metrics indicate steady progress in interpretation workflows with high data integrity.
                        </p>

                        {config.includeCharts && (
                            <div className="h-32 bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 my-4">
                                <BarChart2 className="w-8 h-8 mr-2" /> [Chart Placeholder: Asset Distribution]
                            </div>
                        )}

                        {config.includeTables && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold border-b border-slate-300 pb-1">2. Data Inventory</h3>
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-slate-300"><th className="py-1">Asset Type</th><th className="py-1">Count</th><th className="py-1">Status</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-100"><td className="py-1">Wells</td><td className="py-1">12</td><td className="py-1 text-green-600">Verified</td></tr>
                                        <tr className="border-b border-slate-100"><td className="py-1">Seismic</td><td className="py-1">2</td><td className="py-1 text-green-600">Verified</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportBuilder;