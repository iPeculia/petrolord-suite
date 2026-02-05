import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
    FileText, Download, FileJson, Archive, Settings, 
    Calendar, Users, Layout, Printer, FileSpreadsheet, 
    CheckSquare, Clock, Mail, History, Play
} from 'lucide-react';
import { exportToLAS, generatePDFReport, generateExcelWorkbook, generateBatchExportZip, exportProjectJSON } from '@/utils/petrophysicsExport';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const templates = [
    { id: 'summary', name: 'Well Summary', description: 'Basic headers, location, and curve inventory.', sections: { summary: true, markers: false, properties: false, reserves: false, qc: false } },
    { id: 'full', name: 'Full Interpretation', description: 'Comprehensive analysis including stats and QC.', sections: { summary: true, markers: true, properties: true, reserves: true, qc: true } },
    { id: 'reserves', name: 'Reserves Report', description: 'Focused on volumetric estimation and pay.', sections: { summary: true, markers: true, properties: false, reserves: true, qc: false } },
    { id: 'qc', name: 'Data Quality Audit', description: 'QC flags, gaps, and statistical outliers.', sections: { summary: true, markers: false, properties: false, reserves: false, qc: true } },
];

const ReportsPanel = ({ petroState }) => {
    const { activeWellId, wells, markers, projectId, projectName, qcReport, reserves } = petroState;
    const activeWell = wells.find(w => w.id === activeWellId);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('builder');

    // Builder State
    const [reportConfig, setReportConfig] = useState({
        title: 'Petrophysical Evaluation',
        client: 'Internal',
        footer: 'Confidential',
        brandColor: [41, 128, 185], // Blue
        sections: {
            summary: true,
            markers: true,
            properties: true,
            reserves: true,
            qc: true
        }
    });

    // Batch Export State
    const [selectedWells, setSelectedWells] = useState([]);
    const [batchFormat, setBatchFormat] = useState('las');
    const [isExporting, setIsExporting] = useState(false);

    // Scheduling State
    const [schedule, setSchedule] = useState({
        frequency: 'weekly',
        recipients: '',
        enabled: false
    });

    // History State (Mock)
    const [history, setHistory] = useState([
        { id: 1, name: 'Weekly Summary.pdf', date: '2025-11-20', type: 'PDF', size: '2.4 MB' },
        { id: 2, name: 'Batch_LAS_Export.zip', date: '2025-11-18', type: 'ZIP', size: '45 MB' },
    ]);

    // --- Handlers ---

    const handleSingleExport = (format) => {
        if (!activeWell) {
            toast({ title: "No Well Selected", description: "Select a well to export.", variant: "destructive" });
            return;
        }

        try {
            if (format === 'pdf') {
                const doc = generatePDFReport(activeWell, { name: projectName }, markers, reserves, qcReport, reportConfig);
                doc.save(`${activeWell.name}_Report.pdf`);
                toast({ title: "PDF Generated", description: "Report downloaded successfully." });
            } else if (format === 'excel') {
                const wb = generateExcelWorkbook(activeWell, { name: projectName }, markers, reserves, qcReport);
                XLSX.writeFile(wb, `${activeWell.name}_Analysis.xlsx`);
                toast({ title: "Excel Exported", description: "Workbook downloaded successfully." });
            } else if (format === 'las') {
                const content = exportToLAS(activeWell);
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, `${activeWell.name}.las`);
                toast({ title: "LAS Exported", description: "Log data downloaded successfully." });
            } else if (format === 'json') {
                exportProjectJSON(petroState);
                toast({ title: "Project Archived", description: "Full project JSON downloaded." });
            }
            
            // Add to mock history
            setHistory(prev => [{ id: Date.now(), name: `${activeWell.name}.${format}`, date: new Date().toISOString().split('T')[0], type: format.toUpperCase(), size: '1.2 MB' }, ...prev]);

        } catch (err) {
            console.error(err);
            toast({ title: "Export Failed", description: "An error occurred.", variant: "destructive" });
        }
    };

    const handleBatchExport = async () => {
        if (selectedWells.length === 0) {
            toast({ title: "No Selection", description: "Select at least one well.", variant: "destructive" });
            return;
        }
        setIsExporting(true);
        try {
            const wellsToExport = wells.filter(w => selectedWells.includes(w.id));
            const zipBlob = await generateBatchExportZip(wellsToExport, { name: projectName }, batchFormat);
            saveAs(zipBlob, `${projectName}_Batch_Export.zip`);
            toast({ title: "Batch Export Complete", description: `Downloaded ${wellsToExport.length} wells.` });
            setHistory(prev => [{ id: Date.now(), name: `${projectName}_Batch.zip`, date: new Date().toISOString().split('T')[0], type: 'ZIP', size: 'VAR' }, ...prev]);
        } catch (err) {
            console.error(err);
            toast({ title: "Batch Failed", variant: "destructive" });
        } finally {
            setIsExporting(false);
        }
    };

    const loadTemplate = (tpl) => {
        setReportConfig(prev => ({
            ...prev,
            title: tpl.name,
            sections: tpl.sections
        }));
        toast({ title: "Template Applied", description: `Configuration set to ${tpl.name}` });
    };

    const toggleSection = (key) => {
        setReportConfig(prev => ({
            ...prev,
            sections: { ...prev.sections, [key]: !prev.sections[key] }
        }));
    };

    const toggleWellSelection = (id) => {
        setSelectedWells(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="border-b border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                     <FileText className="w-5 h-5 text-orange-500" />
                     <h2 className="text-lg font-semibold text-white">Advanced Reporting</h2>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="bg-slate-800">
                        <TabsTrigger value="builder">Report Builder</TabsTrigger>
                        <TabsTrigger value="batch">Batch Export</TabsTrigger>
                        <TabsTrigger value="schedule">Scheduling</TabsTrigger>
                        <TabsTrigger value="archive">Archive</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-hidden p-4">
                
                {/* --- BUILDER TAB --- */}
                {activeTab === 'builder' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 space-y-6 overflow-y-auto">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Configuration</CardTitle>
                                    <CardDescription>Customize your report structure.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Report Title</Label>
                                        <Input value={reportConfig.title} onChange={e => setReportConfig({...reportConfig, title: e.target.value})} className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input value={reportConfig.client} onChange={e => setReportConfig({...reportConfig, client: e.target.value})} className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Footer Text</Label>
                                        <Input value={reportConfig.footer} onChange={e => setReportConfig({...reportConfig, footer: e.target.value})} className="bg-slate-950 border-slate-700" />
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-800 space-y-3">
                                        <Label className="text-xs uppercase text-slate-500">Sections</Label>
                                        {Object.keys(reportConfig.sections).map(key => (
                                            <div key={key} className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-slate-800">
                                                <span className="text-sm capitalize">{key}</span>
                                                <Switch checked={reportConfig.sections[key]} onCheckedChange={() => toggleSection(key)} />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">Templates</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-2">
                                    {templates.map(tpl => (
                                        <Button 
                                            key={tpl.id} 
                                            variant="outline" 
                                            className="justify-start h-auto py-3 border-slate-700 hover:bg-slate-800 text-left"
                                            onClick={() => loadTemplate(tpl)}
                                        >
                                            <Layout className="w-4 h-4 mr-3 text-blue-400" />
                                            <div>
                                                <div className="text-sm font-medium text-white">{tpl.name}</div>
                                                <div className="text-[10px] text-slate-500">{tpl.description}</div>
                                            </div>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-8 flex flex-col">
                             <Card className="flex-1 bg-white border-slate-800 overflow-hidden flex flex-col mb-4">
                                <div className="bg-slate-100 border-b px-4 py-2 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Live Preview</span>
                                    <Badge variant="outline" className="bg-white text-slate-600">A4 Portrait</Badge>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto font-serif text-slate-900 bg-white shadow-inner">
                                    <div className="max-w-2xl mx-auto space-y-8">
                                        <div className="text-center border-b-2 border-blue-800 pb-4">
                                            <h1 className="text-3xl font-bold text-blue-900">{reportConfig.title}</h1>
                                            <p className="text-slate-500 mt-2">Prepared for {reportConfig.client}</p>
                                            <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
                                        </div>
                                        
                                        {reportConfig.sections.summary && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-bold text-slate-800 border-b">1. Executive Summary</h3>
                                                <p className="text-sm text-slate-600">
                                                    Analysis for well <strong>{activeWell?.name || 'Unknown'}</strong> performed on project {projectName}. 
                                                    Data coverage extends from {activeWell?.depthRange.min || 0} to {activeWell?.depthRange.max || 0}.
                                                </p>
                                            </div>
                                        )}

                                        {reportConfig.sections.markers && (
                                            <div className="space-y-2 opacity-60">
                                                <h3 className="text-lg font-bold text-slate-800 border-b">2. Stratigraphy</h3>
                                                <div className="h-20 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400 italic">
                                                    [Marker Table Placeholder]
                                                </div>
                                            </div>
                                        )}

                                        {reportConfig.sections.properties && (
                                            <div className="space-y-2 opacity-60">
                                                <h3 className="text-lg font-bold text-slate-800 border-b">3. Petrophysical Properties</h3>
                                                <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400 italic">
                                                    [Property Statistics & Histogram Placeholder]
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             </Card>

                             <div className="grid grid-cols-4 gap-4">
                                 <Button className="bg-red-600 hover:bg-red-500" onClick={() => handleSingleExport('pdf')}>
                                     <Printer className="w-4 h-4 mr-2" /> Export PDF
                                 </Button>
                                 <Button className="bg-green-600 hover:bg-green-500" onClick={() => handleSingleExport('excel')}>
                                     <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
                                 </Button>
                                 <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => handleSingleExport('las')}>
                                     <FileText className="w-4 h-4 mr-2" /> Export LAS
                                 </Button>
                                 <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => handleSingleExport('json')}>
                                     <FileJson className="w-4 h-4 mr-2" /> Backup JSON
                                 </Button>
                             </div>
                        </div>
                    </div>
                )}

                {/* --- BATCH EXPORT TAB --- */}
                {activeTab === 'batch' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                         <div className="lg:col-span-8 flex flex-col gap-4">
                             <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col">
                                 <CardHeader>
                                     <div className="flex justify-between items-center">
                                         <CardTitle className="text-white">Select Wells</CardTitle>
                                         <div className="flex gap-2">
                                             <Button variant="ghost" size="sm" onClick={() => setSelectedWells(wells.map(w => w.id))}>Select All</Button>
                                             <Button variant="ghost" size="sm" onClick={() => setSelectedWells([])}>Clear</Button>
                                         </div>
                                     </div>
                                 </CardHeader>
                                 <div className="flex-1 overflow-y-auto px-6 pb-6">
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                         {wells.map(well => (
                                             <div 
                                                 key={well.id} 
                                                 onClick={() => toggleWellSelection(well.id)}
                                                 className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedWells.includes(well.id) ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                                             >
                                                 <div className="flex items-start justify-between">
                                                     <div className="flex items-center gap-3">
                                                         <CheckSquare className={`w-4 h-4 ${selectedWells.includes(well.id) ? 'text-blue-500' : 'text-slate-600'}`} />
                                                         <div>
                                                             <div className="text-sm font-medium text-white">{well.name}</div>
                                                             <div className="text-xs text-slate-500">{well.api || 'No API'}</div>
                                                         </div>
                                                     </div>
                                                     <Badge variant="secondary" className="text-[10px]">{well.data?.length} rows</Badge>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </Card>
                         </div>
                         <div className="lg:col-span-4 space-y-6">
                             <Card className="bg-slate-900 border-slate-800">
                                 <CardHeader><CardTitle className="text-white">Export Settings</CardTitle></CardHeader>
                                 <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                         <Label>Format</Label>
                                         <Select value={batchFormat} onValueChange={setBatchFormat}>
                                             <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="las">LAS 2.0 (Log Data)</SelectItem>
                                                 <SelectItem value="excel">Excel Reports</SelectItem>
                                                 <SelectItem value="pdf">PDF Reports</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     </div>
                                     <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                         <div className="flex justify-between text-sm mb-2">
                                             <span className="text-slate-400">Selected Wells:</span>
                                             <span className="text-white font-bold">{selectedWells.length}</span>
                                         </div>
                                         <div className="flex justify-between text-sm">
                                             <span className="text-slate-400">Estimated Size:</span>
                                             <span className="text-white">~{(selectedWells.length * 0.5).toFixed(1)} MB</span>
                                         </div>
                                     </div>
                                     <Button 
                                         className="w-full bg-blue-600 hover:bg-blue-500" 
                                         onClick={handleBatchExport}
                                         disabled={isExporting}
                                     >
                                         {isExporting ? <span className="animate-spin mr-2">⌛</span> : <Download className="w-4 h-4 mr-2" />}
                                         Export as ZIP
                                     </Button>
                                 </CardContent>
                             </Card>
                         </div>
                    </div>
                )}

                {/* --- SCHEDULING TAB --- */}
                {activeTab === 'schedule' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500" /> Automated Reporting
                                </CardTitle>
                                <CardDescription>Schedule recurring report generation and email delivery.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded border border-slate-800">
                                    <div className="space-y-1">
                                        <div className="font-medium text-white">Enable Schedule</div>
                                        <div className="text-xs text-slate-500">Reports will be generated automatically.</div>
                                    </div>
                                    <Switch checked={schedule.enabled} onCheckedChange={e => setSchedule({...schedule, enabled: e})} />
                                </div>

                                {schedule.enabled && (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Frequency</Label>
                                                <Select value={schedule.frequency} onValueChange={e => setSchedule({...schedule, frequency: e})}>
                                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="daily">Daily (08:00 AM)</SelectItem>
                                                        <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                                                        <SelectItem value="monthly">Monthly (1st)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Format</Label>
                                                <Select defaultValue="pdf">
                                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pdf">PDF Summary</SelectItem>
                                                        <SelectItem value="excel">Excel Data</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Recipients (Comma separated)</Label>
                                            <Input 
                                                placeholder="team@company.com, manager@company.com" 
                                                className="bg-slate-950 border-slate-700"
                                                value={schedule.recipients}
                                                onChange={e => setSchedule({...schedule, recipients: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Content Template</Label>
                                            <Select defaultValue="summary">
                                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="summary">Well Summary</SelectItem>
                                                    <SelectItem value="full">Full Interpretation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={!schedule.enabled} onClick={() => toast({ title: "Schedule Saved", description: "Automated reports configured." })}>
                                    Save Schedule
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {/* --- ARCHIVE TAB --- */}
                {activeTab === 'archive' && (
                    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-white">Report Archive</CardTitle>
                                    <CardDescription>History of generated and exported reports.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm" className="border-slate-700"><History className="w-4 h-4 mr-2" /> Filter</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Report Name</TableHead>
                                        <TableHead className="text-slate-400">Date</TableHead>
                                        <TableHead className="text-slate-400">Type</TableHead>
                                        <TableHead className="text-slate-400">Size</TableHead>
                                        <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell className="font-medium text-white flex items-center gap-2">
                                                {item.type === 'PDF' ? <FileText className="w-4 h-4 text-red-400" /> : item.type === 'ZIP' ? <Archive className="w-4 h-4 text-yellow-400" /> : <FileSpreadsheet className="w-4 h-4 text-green-400" />}
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-slate-400">{item.date}</TableCell>
                                            <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                                            <TableCell className="text-slate-400">{item.size}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">Download</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
};

export default ReportsPanel;