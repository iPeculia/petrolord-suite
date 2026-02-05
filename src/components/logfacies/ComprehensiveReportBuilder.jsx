import React from 'react';
import { FileText, Download, FileBarChart, Presentation, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ComprehensiveReportBuilder = () => {
    const { toast } = useToast();

    const handleGenerate = (format) => {
        toast({
            title: "Generating Report",
            description: `Compiling analysis results into ${format} format...`,
        });
        setTimeout(() => {
            toast({
                title: "Report Ready",
                description: "Download starting...",
                className: "bg-green-900 border-green-800"
            });
        }, 2000);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="border-b border-slate-800 py-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <LayoutTemplate className="w-5 h-5 text-blue-400"/> 
                    Report Builder
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 flex-1">
                <div className="space-y-4">
                    <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Report Sections</Label>
                    <div className="grid grid-cols-1 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                        {[
                            'Executive Summary & Key Findings',
                            'Data Quality Control & Input Stats',
                            'Facies Classification Methodology',
                            'Depth Plots (Main Reservoir Zones)',
                            'Crossplots & Feature Importance',
                            'Net Pay & Volumetrics Summary',
                            'Appendix: Raw Data Tables'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-3 group">
                                <Checkbox id={`rep-${i}`} defaultChecked={i < 5} className="border-slate-600 data-[state=checked]:bg-blue-600" />
                                <label htmlFor={`rep-${i}`} className="text-sm text-slate-300 cursor-pointer select-none group-hover:text-white transition-colors">{item}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Export Format</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => handleGenerate('PDF')} variant="outline" className="h-auto py-6 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:border-red-500/50 hover:text-red-400 group transition-all">
                            <FileBarChart className="w-8 h-8 text-slate-500 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                            <span>PDF Document</span>
                        </Button>
                        <Button onClick={() => handleGenerate('PPTX')} variant="outline" className="h-auto py-6 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 hover:text-orange-400 group transition-all">
                            <Presentation className="w-8 h-8 text-slate-500 group-hover:text-orange-500 group-hover:scale-110 transition-all" />
                            <span>PowerPoint</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ComprehensiveReportBuilder;