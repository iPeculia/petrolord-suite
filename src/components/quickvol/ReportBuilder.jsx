import React, { useState, useEffect } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, BarChart3, Table as TableIcon, GripVertical, X, Plus, 
    Download, Save, LayoutTemplate, Printer, Settings, Eye, FileOutput,
    Mail, Lock, FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, ComposedChart, Line
} from 'recharts';

import { REPORT_TEMPLATES, generateReportData, exportToPdf, exportToExcel, exportToWordMock } from '@/utils/quickvolReportUtils';

// --- Helper Components for Report Sections ---

const SectionWrapper = ({ children, id, title, onDelete, editMode }) => (
    <Card className="mb-4 border-slate-800 bg-slate-950/50 shadow-sm break-inside-avoid">
        {editMode && (
            <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-900/50 handle cursor-move rounded-t-lg no-print">
                <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={() => onDelete(id)}>
                    <X className="w-3 h-3" />
                </Button>
            </div>
        )}
        <div className="p-4">
            {children}
        </div>
    </Card>
);

const KpiGrid = ({ data }) => {
    const kpis = [
        { label: 'P90', value: data?.p10 || '-', color: 'text-slate-400' },
        { label: 'P50', value: data?.p50 || '-', color: 'text-lime-400' },
        { label: 'P10', value: data?.p90 || '-', color: 'text-cyan-400' },
        { label: 'Mean', value: data?.mean || '-', color: 'text-white' },
    ];
    return (
        <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-500 uppercase mb-1">{k.label}</div>
                    <div className={`text-xl font-bold ${k.color}`}>{typeof k.value === 'number' ? k.value.toLocaleString(undefined, {maximumFractionDigits: 1}) : k.value}</div>
                </div>
            ))}
        </div>
    );
};

const ReportBuilder = ({ 
    mapResults, 
    stochasticResults, 
    surfaceInputs, 
    stochasticInputs,
    validationResults 
}) => {
    const { toast } = useToast();
    const [sections, setSections] = useState([]);
    const [activeTemplate, setActiveTemplate] = useState('technical');
    const [isEditMode, setIsEditMode] = useState(true);
    const [reportMeta, setReportMeta] = useState({
        title: 'QuickVol Analysis Report',
        author: 'Chief Geologist',
        date: new Date().toISOString().slice(0, 10),
        confidential: true,
        company: 'Petrolord Energy'
    });

    useEffect(() => {
        // Initial Load
        handleTemplateChange('technical');
    }, []);

    const handleTemplateChange = (val) => {
        setActiveTemplate(val);
        const newSections = generateReportData(val, { stochasticResults });
        setSections(newSections);
    };

    const handleDeleteSection = (id) => {
        setSections(prev => prev.filter(s => s.id !== id));
    };

    const handleAddSection = (type) => {
        const newSection = {
            id: `${type}_${Date.now()}`,
            type,
            title: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
            content: 'New section content...'
        };
        setSections(prev => [...prev, newSection]);
    };

    const handleExport = async (format) => {
        const prevMode = isEditMode;
        setIsEditMode(false); // Switch to view mode for clean capture
        
        // Small delay to allow render update
        setTimeout(async () => {
            try {
                if (format === 'pdf') {
                    await exportToPdf('report-preview-container', `QuickVol_Report_${reportMeta.date}.pdf`, reportMeta.confidential ? 'CONFIDENTIAL' : '');
                } else if (format === 'excel') {
                    exportToExcel({ mapResults, stochasticResults, stochasticInputs, reportMeta });
                } else if (format === 'word') {
                    exportToWordMock(`QuickVol_Report_${reportMeta.date}.doc`);
                }
                toast({ title: "Export Successful", description: `Report exported as ${format.toUpperCase()}` });
            } catch (e) {
                toast({ title: "Export Failed", description: e.message, variant: "destructive" });
            } finally {
                setIsEditMode(prevMode);
            }
        }, 100);
    };

    // --- Renderers ---

    const renderSectionContent = (section) => {
        switch (section.type) {
            case 'header':
                return (
                    <div className="flex justify-between items-end border-b border-slate-700 pb-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{reportMeta.title}</h1>
                            <p className="text-slate-400">{reportMeta.company} | {reportMeta.date} | {reportMeta.author}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-lime-500">QuickVol</div>
                            {reportMeta.confidential && <Badge variant="destructive">CONFIDENTIAL</Badge>}
                        </div>
                    </div>
                );
            case 'footer':
                return (
                    <div className="border-t border-slate-800 pt-4 mt-8 flex justify-between text-xs text-slate-500">
                        <span>Generated by QuickVol Pro</span>
                        <span>Page 1 of 1</span>
                    </div>
                );
            case 'text':
                return <p className="text-slate-300 leading-relaxed">{section.content}</p>;
            
            case 'kpi-grid':
                return <KpiGrid data={stochasticResults?.in_place} />;
            
            case 'table-inputs':
                return (
                     <div className="overflow-hidden rounded-lg border border-slate-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-slate-400">
                                <tr>
                                    <th className="p-2">Parameter</th>
                                    <th className="p-2">Distribution</th>
                                    <th className="p-2">Values</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {Object.entries(stochasticInputs || {}).slice(0, 6).map(([k, v]) => (
                                    <tr key={k}>
                                        <td className="p-2 capitalize text-slate-300">{k.replace('_', ' ')}</td>
                                        <td className="p-2 text-slate-400">{v.dist || 'Constant'}</td>
                                        <td className="p-2 text-slate-500 font-mono text-xs">{JSON.stringify(v).slice(0, 40)}...</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                );

            case 'table-deterministic':
                return (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between">
                            <span className="text-slate-400">STOOIP</span>
                            <span className="text-white font-bold">{mapResults?.stooip?.toFixed(1) || '-'}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between">
                            <span className="text-slate-400">GIIP</span>
                            <span className="text-white font-bold">{mapResults?.giip?.toFixed(1) || '-'}</span>
                        </div>
                    </div>
                );

            case 'chart-histogram':
                if (!stochasticResults?.in_place?.histogram) return <div className="h-20 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">No Data</div>;
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stochasticResults.in_place.histogram}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="bin" stroke="#475569" fontSize={10} tickFormatter={(val) => val.toFixed(0)} />
                                <YAxis stroke="#475569" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} itemStyle={{ color: '#fff' }} />
                                <Bar dataKey="frequency" fill="#84cc16" name="Frequency" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'chart-cdf':
                 if (!stochasticResults?.in_place?.cdf) return <div className="h-20 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">No Data</div>;
                 return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stochasticResults.in_place.cdf}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="x" stroke="#475569" fontSize={10} type="number" domain={['auto', 'auto']} />
                                <YAxis stroke="#475569" fontSize={10} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="y" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Cumulative Prob" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 );

            case 'chart-tornado':
                if (!stochasticResults?.sensitivity) return <div className="h-20 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">No Sensitivity Data</div>;
                // Transform for Tornado
                const tornadoData = stochasticResults.sensitivity.map(s => ({
                    name: s.parameter,
                    low: s.low - s.base,
                    high: s.high - s.base
                }));
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={tornadoData} stackOffset="sign">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis type="number" stroke="#475569" fontSize={10} />
                                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                <Bar dataKey="low" fill="#ef4444" stackId="stack" name="Low Impact" />
                                <Bar dataKey="high" fill="#22c55e" stackId="stack" name="High Impact" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            default:
                return <div className="p-4 text-center text-slate-500 bg-slate-900 rounded">Widget Placeholder: {section.type}</div>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">Template</Label>
                        <Select value={activeTemplate} onValueChange={handleTemplateChange}>
                            <SelectTrigger className="w-[180px] h-8 bg-slate-950 border-slate-700">
                                <SelectValue placeholder="Select Template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="executive">Executive Summary</SelectItem>
                                <SelectItem value="technical">Technical Report</SelectItem>
                                <SelectItem value="detailed">Detailed Audit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator orientation="vertical" className="h-6 bg-slate-700" />
                    <div className="flex items-center gap-2">
                         <Button variant={isEditMode ? "secondary" : "ghost"} size="sm" onClick={() => setIsEditMode(true)}><LayoutTemplate className="w-4 h-4 mr-2" /> Edit</Button>
                         <Button variant={!isEditMode ? "secondary" : "ghost"} size="sm" onClick={() => setIsEditMode(false)}><Eye className="w-4 h-4 mr-2" /> Preview</Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-slate-700"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Report Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Report Title</Label>
                                    <Input value={reportMeta.title} onChange={e => setReportMeta({...reportMeta, title: e.target.value})} className="bg-slate-950 border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input value={reportMeta.author} onChange={e => setReportMeta({...reportMeta, author: e.target.value})} className="bg-slate-950 border-slate-800" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="confidential" checked={reportMeta.confidential} onCheckedChange={c => setReportMeta({...reportMeta, confidential: c})} />
                                    <Label htmlFor="confidential">Mark as Confidential</Label>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" className="border-slate-700" onClick={() => handleExport('excel')}>
                        <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" /> Excel
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-700" onClick={() => handleExport('word')}>
                        <FileText className="w-4 h-4 mr-2 text-blue-500" /> Word
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleExport('pdf')}>
                        <FileText className="w-4 h-4 mr-2" /> PDF
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Sidebar - Widgets (Edit Mode Only) */}
                <AnimatePresence initial={false}>
                    {isEditMode && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 250, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-r border-slate-800 bg-slate-900/30 flex flex-col min-w-[250px]"
                        >
                            <div className="p-4 font-semibold text-slate-400 text-xs uppercase tracking-wider">Add Sections</div>
                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-2">
                                    <Button variant="outline" className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleAddSection('text')}>
                                        <FileText className="w-4 h-4 mr-2" /> Text Block
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleAddSection('chart-histogram')}>
                                        <BarChart3 className="w-4 h-4 mr-2" /> Histogram
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleAddSection('chart-tornado')}>
                                        <BarChart3 className="w-4 h-4 mr-2" /> Tornado Chart
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleAddSection('table-inputs')}>
                                        <TableIcon className="w-4 h-4 mr-2" /> Input Table
                                    </Button>
                                     <Button variant="outline" className="w-full justify-start border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleAddSection('audit-log')}>
                                        <Lock className="w-4 h-4 mr-2" /> Audit Log
                                    </Button>
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Canvas */}
                <div className="flex-1 overflow-auto bg-slate-950 relative p-8" id="report-preview-container">
                     {/* Watermark */}
                     {reportMeta.confidential && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] overflow-hidden">
                            <div className="-rotate-45 text-[150px] font-black text-slate-500 whitespace-nowrap select-none">
                                CONFIDENTIAL
                            </div>
                        </div>
                     )}

                     <div className="max-w-[800px] mx-auto min-h-[1000px] bg-slate-900/20 backdrop-blur-sm border border-slate-800/50 shadow-2xl p-12 relative z-10">
                        {isEditMode ? (
                            <Reorder.Group axis="y" values={sections} onReorder={setSections}>
                                {sections.map((section) => (
                                    <Reorder.Item key={section.id} value={section}>
                                        <SectionWrapper 
                                            id={section.id} 
                                            title={section.title} 
                                            onDelete={handleDeleteSection}
                                            editMode={true}
                                        >
                                            {renderSectionContent(section)}
                                        </SectionWrapper>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        ) : (
                            <div className="space-y-6">
                                {sections.map(section => (
                                    <div key={section.id} className="break-inside-avoid">
                                        {renderSectionContent(section)}
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ReportBuilder;