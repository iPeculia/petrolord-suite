import React from 'react';
import { FileText, Download, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AutoReportGenerator = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400"/> Report Builder</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-slate-400 uppercase text-xs font-bold">Include Sections</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec1" defaultChecked />
                            <label htmlFor="sec1" className="text-sm text-slate-300">Executive Summary</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec2" defaultChecked />
                            <label htmlFor="sec2" className="text-sm text-slate-300">Input Data QC</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec3" defaultChecked />
                            <label htmlFor="sec3" className="text-sm text-slate-300">Facies Statistics</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec4" defaultChecked />
                            <label htmlFor="sec4" className="text-sm text-slate-300">Depth Plots</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec5" defaultChecked />
                            <label htmlFor="sec5" className="text-sm text-slate-300">Crossplots</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sec6" />
                            <label htmlFor="sec6" className="text-sm text-slate-300">Appendix (Raw Data)</label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white"><Download className="w-4 h-4 mr-2" /> PDF Report</Button>
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"><Download className="w-4 h-4 mr-2" /> PowerPoint</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AutoReportGenerator;