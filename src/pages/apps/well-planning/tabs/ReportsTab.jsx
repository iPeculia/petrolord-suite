import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Download, Printer, FileText, LayoutTemplate, History } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const ReportSection = ({ title, data }) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
        <div className="mb-6 break-inside-avoid">
            <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-1 mb-2 uppercase">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-xs">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start break-all">
                        <span className="text-slate-600 capitalize font-semibold mr-2">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-mono text-slate-900 text-right">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReportsTab = ({ wellId, user }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [generatedReports, setGeneratedReports] = useState([]);
    
    // Content Selection State
    const [contentSelection, setContentSelection] = useState({
        overview: true,
        targets: true,
        trajectory: true,
        antiCollision: true,
        casing: false,
        costing: false
    });

    const { toast } = useToast();

    const generateReport = async () => {
        setLoading(true);
        setReportData(null);
        try {
            // Fetch Data based on selection
            const { data: well, error: wellError } = await supabase.from('wells').select('*').eq('id', wellId).single();
            if (wellError) throw wellError;

            let targets = [];
            if (contentSelection.targets) {
                const { data: t } = await supabase.from('well_targets').select('name, tvd_m, x, y').eq('well_id', wellId);
                targets = t || [];
            }

            let plan = null;
            let acResults = null;
            
            if (contentSelection.trajectory || contentSelection.antiCollision) {
                const { data: p } = await supabase.from('trajectory_plans').select('id, plan_name, stations, qa').eq('well_id', wellId).order('created_at', { ascending: false }).limit(1).single();
                plan = p;
                
                if (contentSelection.antiCollision && plan) {
                    const { data: ac } = await supabase.from('anticollision_checks').select('results').eq('trajectory_plan_id', plan.id).limit(1).single();
                    acResults = ac;
                }
            }

            const data = {
                metadata: {
                    title: `Well Planning Report: ${well.name}`,
                    generated_by: user?.email || 'Unknown User',
                    date: new Date().toLocaleString(),
                    project_id: well.project_id
                },
                well: contentSelection.overview ? { name: well.name, type: well.well_type, depth_unit: well.depth_unit, crs: well.crs } : null,
                targets: contentSelection.targets ? targets : null,
                trajectory_summary: contentSelection.trajectory && plan ? {
                    plan_name: plan.plan_name,
                    station_count: plan.stations.length,
                    max_dls: plan.qa?.maxDLS?.toFixed(2),
                    total_md: plan.stations[plan.stations.length - 1]?.MD.toFixed(2)
                } : null,
                anti_collision_summary: contentSelection.antiCollision ? (acResults?.results?.summary ? "Run completed" : "Not run") : null,
            };
            
            setReportData(data);
            
            // Log to history (Mock for now, or insert into a 'reports' table if exists)
            const newHistoryItem = {
                id: Date.now(),
                date: new Date(),
                name: `Report - ${well.name} - ${format(new Date(), 'MMM dd')}`,
                type: 'PDF'
            };
            setGeneratedReports(prev => [newHistoryItem, ...prev]);

            toast({ title: "Report Generated", description: "Preview is ready below." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Generation Failed", description: error.message });
        }
        setLoading(false);
    };
    
    const exportToPDF = () => {
        if (!reportData) return;
        const doc = new jsPDF();
        
        // Branding Header
        doc.setFillColor(15, 23, 42); // Slate-950
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("Petrolord", 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(76, 175, 80); // Green
        doc.text("Well Planning Pro", 14, 28);
        
        // Metadata
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Report: ${reportData.metadata.title}`, 14, 50);
        doc.text(`Date: ${reportData.metadata.date}`, 14, 56);
        doc.text(`Generated By: ${reportData.metadata.generated_by}`, 14, 62);
        
        let y = 75;

        const addSection = (title, data) => {
            if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) return;
            
            // Check page break
            if (y > 270) { doc.addPage(); y = 20; }

            doc.setFontSize(14);
            doc.setFillColor(240, 240, 240);
            doc.rect(14, y - 6, 182, 8, 'F');
            doc.text(title, 16, y);
            y += 10;

            if (Array.isArray(data)) {
                const head = [Object.keys(data[0]).map(k => k.toUpperCase())];
                const body = data.map(row => Object.values(row).map(v => typeof v === 'number' ? v.toFixed(2) : String(v)));
                
                doc.autoTable({ 
                    startY: y, 
                    head: head, 
                    body: body, 
                    theme: 'grid',
                    headStyles: { fillColor: [51, 65, 85] } // Slate-700
                });
                y = doc.lastAutoTable.finalY + 15;
            } else {
                const tableData = Object.entries(data).map(([k, v]) => [k.replace(/_/g, ' ').toUpperCase(), typeof v === 'object' ? JSON.stringify(v) : String(v)]);
                doc.autoTable({ 
                    startY: y, 
                    body: tableData, 
                    theme: 'striped',
                    showHead: 'never',
                    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
                });
                y = doc.lastAutoTable.finalY + 15;
            }
        };

        addSection("Well Information", reportData.well);
        addSection("Targets", reportData.targets);
        addSection("Trajectory Summary", reportData.trajectory_summary);
        
        // Footer (Page Numbers)
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
        }

        doc.save(`WellReport_${reportData.well?.name || 'Draft'}.pdf`);
        toast({ title: "PDF Exported", className: "bg-green-600 text-white" });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* Left Panel: Configuration */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="border-b border-slate-800 pb-3">
                            <CardTitle className="text-white flex items-center">
                                <LayoutTemplate className="w-5 h-5 mr-2 text-lime-400" />
                                Report Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-slate-400 text-xs uppercase font-bold">Include Sections</Label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'overview', label: 'Well Overview' },
                                        { id: 'targets', label: 'Targets List' },
                                        { id: 'trajectory', label: 'Trajectory Plan & Plots' },
                                        { id: 'antiCollision', label: 'Anti-Collision Summary' },
                                        { id: 'casing', label: 'Casing Design Summary' },
                                        { id: 'costing', label: 'Cost & AFE Summary' }
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={item.id} 
                                                checked={contentSelection[item.id]}
                                                onCheckedChange={(c) => setContentSelection(prev => ({ ...prev, [item.id]: c }))}
                                                className="border-slate-600 data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500"
                                            />
                                            <Label htmlFor={item.id} className="text-slate-300 font-normal cursor-pointer">{item.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={generateReport} disabled={loading} className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold">
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compiling Data...</> : 'Generate Preview'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 flex-1">
                        <CardHeader className="border-b border-slate-800 pb-3 flex flex-row justify-between items-center">
                            <CardTitle className="text-white flex items-center">
                                <History className="w-5 h-5 mr-2 text-blue-400" />
                                History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {generatedReports.length === 0 ? (
                                    <p className="text-xs text-slate-500 py-4 text-center">No reports generated yet.</p>
                                ) : (
                                    generatedReports.map(report => (
                                        <div key={report.id} className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700">
                                            <div>
                                                <div className="text-sm text-slate-200">{report.name}</div>
                                                <div className="text-[10px] text-slate-500">{format(report.date, 'MMM dd, HH:mm')}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                                                <Download className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Preview */}
                <div className="lg:col-span-2 flex flex-col h-full bg-slate-200 rounded-xl overflow-hidden shadow-inner">
                    <div className="bg-slate-300 border-b border-slate-400 p-2 flex justify-between items-center">
                        <span className="text-slate-600 text-xs font-bold uppercase ml-2">Report Preview</span>
                        <div className="space-x-2">
                            <Button size="sm" variant="ghost" className="h-7 text-slate-700 hover:bg-white" disabled={!reportData} onClick={() => window.print()}>
                                <Printer className="w-3 h-3 mr-1" /> Print
                            </Button>
                            <Button size="sm" className="h-7 bg-slate-700 hover:bg-slate-800 text-white" disabled={!reportData} onClick={exportToPDF}>
                                <Download className="w-3 h-3 mr-1" /> Download PDF
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-8 bg-slate-100 flex justify-center">
                        {reportData ? (
                            <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-[20mm] text-slate-900 origin-top scale-90 sm:scale-100 transition-transform">
                                {/* Print Header */}
                                <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">Petrolord</h1>
                                        <div className="text-sm text-green-600 font-bold uppercase tracking-widest">Well Planning Pro</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-700">{reportData.metadata.title}</div>
                                        <div className="text-xs text-slate-500">{reportData.metadata.date}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-8">
                                    <ReportSection title="Well Information" data={reportData.well} />
                                    {reportData.targets && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-1 mb-2 uppercase">Targets</h3>
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-300">
                                                        <th className="py-1">Name</th>
                                                        <th className="py-1 text-right">TVD (m)</th>
                                                        <th className="py-1 text-right">X</th>
                                                        <th className="py-1 text-right">Y</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reportData.targets.map((t, i) => (
                                                        <tr key={i} className="border-b border-slate-100">
                                                            <td className="py-1 font-medium">{t.name}</td>
                                                            <td className="py-1 text-right font-mono">{t.tvd_m}</td>
                                                            <td className="py-1 text-right font-mono">{t.x}</td>
                                                            <td className="py-1 text-right font-mono">{t.y}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    <ReportSection title="Trajectory Summary" data={reportData.trajectory_summary} />
                                    <ReportSection title="Anti-Collision" data={{ status: reportData.anti_collision_summary }} />
                                </div>

                                {/* Footer Placeholder */}
                                <div className="mt-20 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                                    Generated by Petrolord Well Planning Pro
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                                <FileText className="w-16 h-16 mb-4 opacity-20" />
                                <p>Generate a report to see preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsTab;