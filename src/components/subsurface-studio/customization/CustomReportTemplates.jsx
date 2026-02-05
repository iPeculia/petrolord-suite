import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, LayoutTemplate, Plus } from 'lucide-react';

const CustomReportTemplates = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <LayoutTemplate className="w-5 h-5 mr-2 text-pink-400" /> Report Templates
                </h3>
                <Button className="bg-pink-600 hover:bg-pink-700 text-xs">
                    <Plus className="w-4 h-4 mr-2" /> Create Template
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Monthly Production Report', 'Well Logging QC', 'End of Well Report', 'Reserves Booking'].map((template, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800 hover:border-pink-500/50 transition-all cursor-pointer group">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="p-3 rounded-full bg-pink-950/30 text-pink-400 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-200">{template}</div>
                                <div className="text-xs text-slate-500 mt-1">Updated 2 days ago</div>
                            </div>
                            <div className="flex gap-2 w-full mt-2">
                                <Button size="sm" variant="outline" className="flex-1 text-xs">Edit</Button>
                                <Button size="sm" variant="secondary" className="flex-1 text-xs">Preview</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CustomReportTemplates;