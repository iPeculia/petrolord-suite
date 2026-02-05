import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Image, Table, FileCode, Download, Loader2, CheckCircle } from 'lucide-react';

const ExportOption = ({ icon: Icon, title, description, formats, onExport, isLoading }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <h4 className="font-medium text-slate-900">{title}</h4>
            <p className="text-sm text-slate-500 mb-3">{description}</p>
            <div className="flex gap-2">
                {formats.map(fmt => (
                    <Button 
                        key={fmt} 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => onExport(fmt)}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        {fmt}
                    </Button>
                ))}
            </div>
        </div>
    </div>
);

const ExportPrognosisTab = ({ data }) => {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filename, setFilename] = useState('Well_Prognosis_Report');

    const handleExport = (type, format) => {
        setIsExporting(true);
        setProgress(10);

        // Simulation of export process
        let step = 10;
        const interval = setInterval(() => {
            step += 15;
            setProgress(Math.min(step, 95));
            if (step >= 100) {
                clearInterval(interval);
                setIsExporting(false);
                setProgress(100);
                toast({
                    title: "Export Complete",
                    description: `Successfully exported ${type} as ${format}`,
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800",
                    action: <CheckCircle className="w-5 h-5 text-emerald-600" />
                });
                setTimeout(() => setProgress(0), 2000);
            }
        }, 300);
    };

    return (
        <div className="h-full p-6 bg-slate-50 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Export Data & Reports</h2>
                        <p className="text-slate-500">Generate high-resolution charts, datasets, and comprehensive reports.</p>
                    </div>
                </div>

                {/* Settings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Export Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Filename Prefix</Label>
                            <Input 
                                value={filename} 
                                onChange={(e) => setFilename(e.target.value)} 
                                placeholder="Well_Name_Prognosis"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Chart Resolution (DPI)</Label>
                            <Select defaultValue="300">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select DPI" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="72">72 DPI (Screen)</SelectItem>
                                    <SelectItem value="150">150 DPI (Print)</SelectItem>
                                    <SelectItem value="300">300 DPI (High Quality)</SelectItem>
                                    <SelectItem value="600">600 DPI (Publication)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Include Elements</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c1" defaultChecked />
                                    <label htmlFor="c1" className="text-sm">Uncertainty Bands</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c2" defaultChecked />
                                    <label htmlFor="c2" className="text-sm">Formations</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c3" defaultChecked />
                                    <label htmlFor="c3" className="text-sm">Hard Data (LOT/RFT)</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c4" defaultChecked />
                                    <label htmlFor="c4" className="text-sm">Casing Shoes</label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Export Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExportOption 
                        icon={Image}
                        title="Pressure Prognosis Chart"
                        description="Export the main PP-FG depth plot with all tracks."
                        formats={['PNG', 'PDF', 'SVG']}
                        onExport={(fmt) => handleExport('PP Chart', fmt)}
                        isLoading={isExporting}
                    />
                    <ExportOption 
                        icon={Image}
                        title="Temperature Chart"
                        description="Export the temperature gradient and geothermal analysis."
                        formats={['PNG', 'PDF', 'SVG']}
                        onExport={(fmt) => handleExport('Temp Chart', fmt)}
                        isLoading={isExporting}
                    />
                    <ExportOption 
                        icon={Table}
                        title="Well Logs & Data"
                        description="Export raw curves and calculated pore pressure data."
                        formats={['CSV', 'Excel', 'LAS']}
                        onExport={(fmt) => handleExport('Well Data', fmt)}
                        isLoading={isExporting}
                    />
                     <ExportOption 
                        icon={FileCode}
                        title="Stratigraphic Column"
                        description="Export lithology patterns and formation tops."
                        formats={['PNG', 'SVG']}
                        onExport={(fmt) => handleExport('Stratigraphy', fmt)}
                        isLoading={isExporting}
                    />
                </div>

                {/* Full Report Card */}
                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Comprehensive Final Report</h3>
                                <p className="text-slate-400 text-sm">
                                    Includes all charts, data summaries, risk analysis, and drilling recommendations in a single document.
                                </p>
                            </div>
                        </div>
                        <Button 
                            size="lg" 
                            className="bg-white text-slate-900 hover:bg-slate-100 font-bold"
                            onClick={() => handleExport('Full Report', 'PDF')}
                            disabled={isExporting}
                        >
                            {isExporting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                            Generate PDF Report
                        </Button>
                    </CardContent>
                </Card>

                {/* Global Progress Bar */}
                {isExporting && (
                    <div className="fixed bottom-8 right-8 w-80 bg-white p-4 rounded-lg shadow-2xl border border-slate-200 z-50 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span>Exporting...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExportPrognosisTab;