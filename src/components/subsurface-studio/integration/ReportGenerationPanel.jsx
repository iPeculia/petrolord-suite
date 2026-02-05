import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportGenerationPanel = () => {
    const { toast } = useToast();

    const handleGenerate = () => {
        toast({ title: "Report Generation", description: "Compiling PDF report..." });
        setTimeout(() => toast({ title: "Success", description: "Report downloaded." }), 2000);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <FileText className="w-4 h-4 mr-2 text-rose-400" /> Automated Reports
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="r1" defaultChecked className="border-slate-600 data-[state=checked]:bg-rose-500" />
                        <Label htmlFor="r1" className="text-xs text-slate-300">Project Summary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="r2" defaultChecked className="border-slate-600 data-[state=checked]:bg-rose-500" />
                        <Label htmlFor="r2" className="text-xs text-slate-300">Volumetrics Table</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="r3" className="border-slate-600 data-[state=checked]:bg-rose-500" />
                        <Label htmlFor="r3" className="text-xs text-slate-300">Seismic Screenshots</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="r4" defaultChecked className="border-slate-600 data-[state=checked]:bg-rose-500" />
                        <Label htmlFor="r4" className="text-xs text-slate-300">Well Correlation Fence</Label>
                    </div>
                </div>

                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-xs mt-2" onClick={handleGenerate}>
                    <Download className="w-3 h-3 mr-2" /> Generate PDF
                </Button>
            </CardContent>
        </Card>
    );
};

export default ReportGenerationPanel;