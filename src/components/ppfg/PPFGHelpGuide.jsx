import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, BookOpen, Activity, AlertTriangle, FileText, Settings, Share2, CheckCircle2 } from 'lucide-react';

const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'workflow', label: 'Workflow Guide', icon: Activity },
    { id: 'features', label: 'Detailed Features', icon: Settings },
    { id: 'glossary', label: 'Glossary', icon: FileText },
    { id: 'faq', label: 'FAQ & Troubleshooting', icon: HelpCircle },
];

const PPFGHelpGuide = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hidden md:flex">
                    <HelpCircle className="w-4 h-4" /> User Guide
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[85vh] bg-slate-950 border-slate-800 text-slate-100 p-0 flex flex-col gap-0">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                    <div>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Activity className="w-6 h-6 text-emerald-500" />
                            PP-FG Analyzer Help Center
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 mt-1">
                            Comprehensive documentation, workflow guides, and best practices.
                        </DialogDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
                        <Input 
                            placeholder="Search documentation..." 
                            className="pl-8 bg-slate-950 border-slate-700 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Navigation */}
                    <div className="w-64 bg-slate-900/50 border-r border-slate-800 p-4 hidden md:block">
                        <div className="space-y-1">
                            {sections.map(section => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            activeTab === section.id 
                                            ? 'bg-emerald-600/10 text-emerald-400' 
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col bg-slate-950">
                        <ScrollArea className="flex-1 p-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                                
                                {/* OVERVIEW TAB */}
                                <TabsContent value="overview" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="prose prose-invert max-w-none">
                                        <h2 className="text-2xl font-bold text-white mb-4">Welcome to PP-FG Analyzer</h2>
                                        <p className="text-slate-300 text-lg leading-relaxed">
                                            The Petrolord Pore Pressure & Fracture Gradient (PP-FG) Analyzer is a comprehensive solution for predicting subsurface formation pressures to ensure safe and efficient drilling operations.
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                                                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Predict Risks</h3>
                                                <p className="text-sm text-slate-400">Identify potential kicks, lost circulation zones, and wellbore stability issues before drilling.</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                                                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Optimize Mud Weight</h3>
                                                <p className="text-sm text-slate-400">Calculate the safe operating window to minimize NPT and maximize ROP.</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                                                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Export & Share</h3>
                                                <p className="text-sm text-slate-400">Generate professional reports and export datasets for well planning software integration.</p>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Getting Started</h3>
                                        <ol className="list-decimal list-inside space-y-3 text-slate-300">
                                            <li><strong className="text-white">Prepare Data:</strong> Have your LAS files (GR, RES, DT, RHOB) or CSV data ready.</li>
                                            <li><strong className="text-white">Load Well Data:</strong> Use the "Load Well Data" tab to import logs.</li>
                                            <li><strong className="text-white">Follow Workflow:</strong> Proceed sequentially through the tabs (Analyze Trends → Calc Gradients → Risks).</li>
                                            <li><strong className="text-white">Review Prognosis:</strong> Visualize the final window in the Prognosis tab.</li>
                                        </ol>
                                    </div>
                                </TabsContent>

                                {/* WORKFLOW GUIDE TAB */}
                                <TabsContent value="workflow" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-2">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Step-by-Step Workflow</h2>
                                        <p className="text-slate-400 mb-6">Follow these 6 steps to build a complete pressure model.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { step: 1, title: "Load Well Data", desc: "Import LAS/CSV logs. Ensure Gamma Ray (GR), Resistivity (RES), Sonic (DT), and Density (RHOB) curves are mapped correctly.", action: "Go to 'Load Well Data' tab." },
                                            { step: 2, title: "Analyze Trends", desc: "Pick shale points to establish Normal Compaction Trends (NCT). Adjust the Vshale cutoff to filter out sands.", action: "Go to 'Analyze Pressure Trends' tab." },
                                            { step: 3, title: "Calculate Gradients", desc: "Compute Overburden (OBG), Pore Pressure (PP), and Fracture Gradient (FG) using Eaton or Bowers methods.", action: "Go to 'Calculate Gradients' tab." },
                                            { step: 4, title: "Assess Risks", desc: "Identify hazardous zones where the drilling window is narrow (< 0.5 ppg) or where kicks are likely.", action: "Go to 'Assess Risks' tab." },
                                            { step: 5, title: "QC & Reports", desc: "Validate data quality and generate PDF/Excel reports for stakeholders.", action: "Go to 'QC & Reports' tab." },
                                            { step: 6, title: "Prognosis", desc: "View the final composite chart including temperature, lithology, and casing seats.", action: "View 'Prognosis' tab." },
                                        ].map((item) => (
                                            <div key={item.step} className="flex gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-sm">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                                    <p className="text-slate-400 text-sm mb-2">{item.desc}</p>
                                                    <Badge variant="outline" className="bg-slate-950 text-xs text-slate-500 border-slate-700">
                                                        {item.action}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* DETAILED FEATURES TAB */}
                                <TabsContent value="features" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
                                    <h2 className="text-2xl font-bold text-white mb-6">Feature Guides</h2>
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        <AccordionItem value="f1" className="border border-slate-800 rounded-lg bg-slate-900 px-4">
                                            <AccordionTrigger className="text-slate-200 hover:text-emerald-400">Load Well Data: File Formats</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 text-sm space-y-2 pt-2">
                                                <p>Supported formats: <strong>LAS 2.0, LAS 3.0, CSV</strong>.</p>
                                                <p>Ensure your file has depth in the first column. The importer automatically attempts to map curves based on common mnemonics (e.g., 'GR', 'GAM', 'GAPI' for Gamma Ray).</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="f2" className="border border-slate-800 rounded-lg bg-slate-900 px-4">
                                            <AccordionTrigger className="text-slate-200 hover:text-emerald-400">Analyze Trends: NCT Picking</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 text-sm space-y-2 pt-2">
                                                <p>The Normal Compaction Trend (NCT) is critical for Eaton's method. Use the interactive chart to exclude sand points (yellow) and fit the trend line only to shale points (green/grey).</p>
                                                <p><strong>Tip:</strong> Use the "Vshale Cutoff" slider to refine which points are considered clean shale.</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="f3" className="border border-slate-800 rounded-lg bg-slate-900 px-4">
                                            <AccordionTrigger className="text-slate-200 hover:text-emerald-400">Calculate Gradients: Methods</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 text-sm space-y-2 pt-2">
                                                <p><strong>Eaton Method:</strong> Standard for compaction-driven overpressure. Requires an exponent (typically 3.0 for Sonic).</p>
                                                <p><strong>Bowers Method:</strong> Better for unloading scenarios (high pressure, high temp). Requires velocity data.</p>
                                                <p><strong>Matthews-Kelly:</strong> Used for Fracture Gradient estimation based on effective stress coefficient (k0).</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="f4" className="border border-slate-800 rounded-lg bg-slate-900 px-4">
                                            <AccordionTrigger className="text-slate-200 hover:text-emerald-400">Assess Risks: Heatmap</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 text-sm space-y-2 pt-2">
                                                <p>The Risk Heatmap visualizes the drilling window (FG - PP). Red zones indicate a window less than 0.5 ppg, suggesting a high risk of kicks or losses. Plan casing seats to cover these zones.</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </TabsContent>

                                {/* GLOSSARY TAB */}
                                <TabsContent value="glossary" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
                                    <h2 className="text-2xl font-bold text-white mb-6">Technical Glossary</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { term: "PP", def: "Pore Pressure. The pressure of fluids within the pores of a reservoir." },
                                            { term: "FG", def: "Fracture Gradient. The pressure required to fracture the formation." },
                                            { term: "OBG", def: "Overburden Gradient. The pressure exerted by the total weight of overlying formations." },
                                            { term: "MW", def: "Mud Weight. The density of drilling fluid used to balance formation pressure." },
                                            { term: "LOT", def: "Leak-Off Test. A pressure test to determine the formation fracture pressure." },
                                            { term: "FIT", def: "Formation Integrity Test. A test to verify the formation can withstand a specific pressure." },
                                            { term: "NCT", def: "Normal Compaction Trend. The expected trend of porosity/sonic reduction with depth." },
                                            { term: "ECD", def: "Equivalent Circulating Density. Effective density of fluid while circulating." },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                                                <div className="text-emerald-400 font-bold text-lg mb-1">{item.term}</div>
                                                <div className="text-slate-400 text-sm">{item.def}</div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* FAQ TAB */}
                                <TabsContent value="faq" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
                                    <h2 className="text-2xl font-bold text-white mb-6">FAQ & Troubleshooting</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-2">Why is my chart empty?</h3>
                                            <p className="text-slate-400 text-sm">Charts require valid depth-indexed data. Ensure you have completed Phase 1 (Import) and Phase 2 (Trends) steps successfully. Check for missing null values (-999.25) in your input file.</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-2">How do I change units?</h3>
                                            <p className="text-slate-400 text-sm">Go to the 'Load Well Data' tab and select step 3 'Units'. You can convert meters to feet, or MPa to PSI globally for the project.</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-2">Can I export to Excel?</h3>
                                            <p className="text-slate-400 text-sm">Yes. In the 'QC & Reports' tab, use the 'Export Data' panel to download a CSV or Excel file containing all calculated curves.</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-2">Error: "Invalid Eaton Exponent"</h3>
                                            <p className="text-slate-400 text-sm">This usually happens if the exponent is set to 0 or negative. Typical range is 0.5 to 5.0. Reset to default (3.0) in the Tuning panel.</p>
                                        </div>
                                    </div>
                                </TabsContent>

                            </Tabs>
                        </ScrollArea>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => document.querySelector('[data-state="open"]').click()}>Close Guide</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PPFGHelpGuide;