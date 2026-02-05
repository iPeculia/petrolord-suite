import React from 'react';
import { FileText, Download, FileBarChart, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ReportGenerator = () => {
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
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400"/> Automated Reporting</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Contents</Label>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            'Executive Summary & Key Findings',
                            'Data Quality Control & Input Stats',
                            'Facies Classification Methodology',
                            'Depth Plots (Main Reservoir Zones)',
                            'Crossplots & Feature Importance',
                            'Net Pay & Volumetrics Summary',
                            'Appendix: Raw Data Tables'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <Checkbox id={`rep-${i}`} defaultChecked={i < 5} />
                                <label htmlFor={`rep-${i}`} className="text-sm text-slate-300 cursor-pointer select-none">{item}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-slate-800">
                    <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Export Format</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => handleGenerate('PDF')} variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-slate-800 hover:border-red-500/50 hover:text-red-400 group">
                            <FileBarChart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                            <span>PDF Document</span>
                        </Button>
                        <Button onClick={() => handleGenerate('PPTX')} variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-slate-800 hover:border-orange-500/50 hover:text-orange-400 group">
                            <Presentation className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span>PowerPoint</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportGenerator;