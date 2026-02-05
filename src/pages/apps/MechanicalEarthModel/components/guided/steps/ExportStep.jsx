import React, { useEffect, useState } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, FileSpreadsheet, FileJson, Share2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const [reportSettings, setReportSettings] = useState(state.reportSettings);

    useEffect(() => {
        dispatch({ type: 'SET_VALIDATION', payload: { step: 7, isValid: true } });
    }, [dispatch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch({ type: 'UPDATE_REPORT_SETTINGS', payload: reportSettings });
        }, 500);
        return () => clearTimeout(handler);
    }, [reportSettings, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (id) => {
        setReportSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [id]: !prev.content[id],
            }
        }));
    };

    const notImplemented = (feature = "This feature") => {
        toast({
            title: "🚧 Not Implemented",
            description: `${feature} isn't available yet, but you can request it! 🚀`,
        });
    };
    
    const generateDataForExport = () => {
        if (!state.results?.results?.depth) return [];
        const { results } = state.results;
        return results.depth.map((d, i) => ({
            Depth_ft: d.toFixed(2),
            Sv_psi: results.Sv[i]?.toFixed(2),
            Pp_psi: results.Pp[i]?.toFixed(2),
            Shmin_psi: results.Shmin[i]?.toFixed(2),
            SHmax_psi: results.SHmax[i]?.toFixed(2),
            Fg_psi: results.Fg[i]?.toFixed(2),
        }));
    };

    const handleExport = (format) => {
        const data = generateDataForExport();
        if (data.length === 0) {
            toast({ variant: 'destructive', title: "Export Failed", description: "No calculation data available to export." });
            return;
        }

        toast({ title: "Exporting...", description: `Generating ${format.toUpperCase()} file.` });

        switch (format) {
            case 'csv': {
                const ws = XLSX.utils.json_to_sheet(data);
                const csv = XLSX.utils.sheet_to_csv(ws);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, `${reportSettings.title || 'MEM_Export'}.csv`);
                break;
            }
            case 'json': {
                const blob = new Blob([JSON.stringify({ reportSettings, results: state.results }, null, 2)], { type: 'application/json;charset=utf-8;' });
                saveAs(blob, `${reportSettings.title || 'MEM_Export'}.json`);
                break;
            }
             case 'excel': {
                const wb = XLSX.utils.book_new();
                const summary = [
                    { "Parameter": "Report Title", "Value": reportSettings.title },
                    { "Parameter": "Author", "Value": reportSettings.author },
                    { "Parameter": "Company", "Value": reportSettings.company },
                    { "Parameter": "Quality Score", "Value": state.results?.qualityReport?.score },
                ];
                const wsSummary = XLSX.utils.json_to_sheet(summary);
                XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
                
                const wsData = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, wsData, "Calculated Data");

                XLSX.writeFile(wb, `${reportSettings.title || 'MEM_Export'}.xlsx`);
                break;
            }
            case 'pdf': {
                 const doc = new jsPDF();
                 doc.text(reportSettings.title || "MEM Report", 14, 20);
                 doc.setFontSize(12);
                 doc.text(`Author: ${reportSettings.author}`, 14, 30);
                 doc.text(`Company: ${reportSettings.company}`, 14, 36);

                let startY = 50;

                if (reportSettings.content.executive_summary) {
                     doc.text("Executive Summary", 14, startY);
                     startY += 6;
                     const summaryLines = doc.splitTextToSize(reportSettings.description, 180);
                     doc.text(summaryLines, 14, startY);
                     startY += summaryLines.length * 5 + 10;
                }
                
                if (reportSettings.content.key_findings && state.results.qualityReport?.warnings.length > 0) {
                     autoTable(doc, {
                        startY,
                        head: [['Key Findings & Quality Warnings']],
                        body: state.results.qualityReport.warnings.map(w => [w]),
                        theme: 'grid',
                    });
                    startY = doc.lastAutoTable.finalY + 10;
                }
                
                if (reportSettings.content.data_tables) {
                    autoTable(doc, {
                        startY,
                        head: [Object.keys(data[0])],
                        body: data.slice(0, 25).map(row => Object.values(row)),
                        didDrawPage: (data) => doc.text('Data Table (First 25 rows)', data.settings.margin.left, 20),
                        margin: { top: 30 }
                    });
                }
                 
                 doc.save(`${reportSettings.title || 'MEM_Report'}.pdf`);
                 break;
            }
            default:
                notImplemented(`${format.toUpperCase()} export`);
        }
    };


    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-8"
        >
            <Card className="bg-transparent border-none shadow-none text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-white">Export & Report</CardTitle>
                    <CardDescription className="text-slate-400 text-base">
                        Finalize your report, select content to include, and export your 1D MEM analysis.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle>Report Customization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input name="title" placeholder="Report Title" value={reportSettings.title} onChange={handleInputChange} className="bg-slate-900 border-slate-600"/>
                            <Input name="author" placeholder="Author Name" value={reportSettings.author} onChange={handleInputChange} className="bg-slate-900 border-slate-600"/>
                             <Input name="company" placeholder="Company Name" value={reportSettings.company} onChange={handleInputChange} className="bg-slate-900 border-slate-600"/>
                            <Textarea name="description" placeholder="Report Description or Summary..." value={reportSettings.description} onChange={handleInputChange} className="bg-slate-900 border-slate-600"/>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle>Report Content (for PDF)</CardTitle>
                            <CardDescription>Select sections to include.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(reportSettings.content).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <Checkbox id={key} checked={value} onCheckedChange={() => handleCheckboxChange(key)} />
                                    <label htmlFor={key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 capitalize">{key.replace(/_/g, ' ')}</label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle>Download Data</CardTitle>
                        </CardHeader>
                         <CardContent className="grid grid-cols-2 gap-4">
                           <Button variant="outline" className="h-20 flex-col border-slate-600 hover:bg-slate-700" onClick={() => handleExport('pdf')}>
                                <FileText className="h-6 w-6 mb-1 text-red-400"/> PDF Report
                            </Button>
                             <Button variant="outline" className="h-20 flex-col border-slate-600 hover:bg-slate-700" onClick={() => handleExport('excel')}>
                                <FileSpreadsheet className="h-6 w-6 mb-1 text-green-400"/> Excel
                            </Button>
                             <Button variant="outline" className="h-20 flex-col border-slate-600 hover:bg-slate-700" onClick={() => handleExport('csv')}>
                                <p className='font-bold text-lg'>CSV</p>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col border-slate-600 hover:bg-slate-700" onClick={() => handleExport('json')}>
                                <FileJson className="h-6 w-6 mb-1 text-yellow-400"/> JSON
                            </Button>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle>Sharing Options</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button className="w-full" onClick={() => notImplemented('Email sharing')}><Mail className="mr-2 h-4 w-4"/> Email Report</Button>
                            <Button className="w-full" variant="secondary" onClick={() => notImplemented('Link sharing')}><Share2 className="mr-2 h-4 w-4"/> Get Shareable Link</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card className="bg-slate-900 border-slate-700 sticky top-24">
                        <CardHeader>
                            <CardTitle>Live Report Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[8.5/11] w-full bg-white rounded p-8 overflow-y-auto text-black shadow-lg">
                                <header className="border-b pb-4 mb-6 text-center">
                                    <h1 className="text-2xl font-bold">{reportSettings.title || "Mechanical Earth Model Report"}</h1>
                                    <p className="text-sm text-gray-600">{reportSettings.company || "Your Company"}</p>
                                    <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                                </header>
                                <main className="space-y-4 text-sm">
                                    {reportSettings.content.executive_summary && (
                                        <section>
                                            <h2 className="text-lg font-semibold border-b mb-2">Executive Summary</h2>
                                            <p className="text-gray-700">{reportSettings.description || `This report details the 1D Mechanical Earth Model for well ${state.projectDetails.wellName || 'N/A'}.`}</p>
                                        </section>
                                    )}
                                     {reportSettings.content.key_findings && (
                                        <section>
                                            <h2 className="text-lg font-semibold border-b mb-2">Key Findings & Quality</h2>
                                            <ul className="list-disc list-inside text-gray-700">
                                                {state.results?.qualityReport?.warnings.length > 0 ? (
                                                     state.results.qualityReport.warnings.map((w, i) => <li key={i}>{w}</li>)
                                                ) : (
                                                    <li>No significant quality issues were detected in the calculation.</li>
                                                )}
                                                <li>The primary stress regime is determined to be {state.mechanicalProperties.stressRegime || 'N/A'}.</li>
                                            </ul>
                                        </section>
                                    )}
                                     {reportSettings.content.visualizations && (
                                        <section>
                                            <h2 className="text-lg font-semibold border-b mb-2">Visualizations</h2>
                                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                                                [Chart Area: Visualizations are included in the downloaded PDF]
                                            </div>
                                        </section>
                                    )}
                                     {reportSettings.content.data_tables && (
                                        <section>
                                             <h2 className="text-lg font-semibold border-b mb-2">Data Table (Preview)</h2>
                                             <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                                                [A preview of the data table will be included in the downloaded PDF]
                                             </div>
                                        </section>
                                     )}
                                </main>
                                <footer className="border-t pt-4 mt-6 text-xs text-gray-500 text-center">
                                    <p>Authored by: {reportSettings.author || "N/A"}</p>
                                    <p>Confidential | Page 1 of 1</p>
                                </footer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default ExportStep;