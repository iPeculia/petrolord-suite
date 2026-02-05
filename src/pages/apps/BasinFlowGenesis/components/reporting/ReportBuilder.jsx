import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import { useToast } from '@/components/ui/use-toast';

const ReportBuilder = () => {
    const { toast } = useToast();
    const [sections, setSections] = useState({
        summary: true,
        burialHistory: true,
        thermalHistory: true,
        maturity: true,
        calibration: false,
        stratigraphy: true
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("BasinFlow Genesis Report", 105, 20, null, null, "center");
        
        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");
        
        let yPos = 50;
        
        if (sections.summary) {
            doc.setFontSize(16);
            doc.text("1. Executive Summary", 14, yPos);
            yPos += 10;
            doc.setFontSize(10);
            doc.text("This report contains simulation results for the current basin model.", 14, yPos);
            yPos += 20;
        }

        if (sections.stratigraphy) {
            doc.setFontSize(16);
            doc.text("2. Stratigraphy Model", 14, yPos);
            yPos += 10;
            doc.setFontSize(10);
            doc.text("Layer definition and properties...", 14, yPos);
            yPos += 20;
        }

        if (sections.burialHistory) {
            doc.setFontSize(16);
            doc.text("3. Burial History", 14, yPos);
            yPos += 10;
            doc.setFontSize(10);
            doc.text("See attached plots for burial curves.", 14, yPos);
            yPos += 20;
        }

        // ... Add more mock content logic

        doc.save("BasinFlow_Report.pdf");
        toast({ title: "Report Generated", description: "PDF downloaded successfully." });
    };

    return (
        <div className="h-full p-6 bg-slate-950 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-white">Report Builder</h2>
                </div>

                <Card className="bg-slate-900 border-slate-800 mb-6">
                    <CardHeader><CardTitle className="text-white">Content Selection</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(sections).map(key => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={key} 
                                    checked={sections[key]}
                                    onCheckedChange={(c) => setSections(prev => ({ ...prev, [key]: c }))}
                                    className="border-slate-600 data-[state=checked]:bg-indigo-600"
                                />
                                <Label htmlFor={key} className="text-slate-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 mb-6">
                    <CardHeader><CardTitle className="text-white">Scheduling (Enterprise)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border border-slate-800 rounded bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">Weekly Status Report</p>
                                    <p className="text-xs text-slate-500">Every Monday at 09:00 AM</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Scheduled</Button>
                        </div>
                    </CardContent>
                </Card>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={generatePDF}>
                    <Download className="w-4 h-4 mr-2" /> Generate & Download PDF
                </Button>
            </div>
        </div>
    );
};

export default ReportBuilder;