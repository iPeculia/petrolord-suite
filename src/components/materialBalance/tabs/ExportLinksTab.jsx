import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileJson, FileSpreadsheet, FileText, Share2, Download } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';

const ExportLinksTab = () => {
  const { currentProject, reservoirMetadata, fittedModels, forecastData } = useMaterialBalance();
  const { toast } = useToast();

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ currentProject, reservoirMetadata, fittedModels, forecastData }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject?.name || 'Project'}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: "JSON file downloaded." });
  };

  const handleExportCSV = () => {
    // Stub CSV generation
    toast({ title: "Export Started", description: "CSV generation in progress..." });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-wider">Export & Integrations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* File Exports */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-400" /> File Downloads
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-3 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleExportJSON}>
                        <FileJson className="w-4 h-4 text-yellow-500" /> Full Project JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleExportCSV}>
                        <FileSpreadsheet className="w-4 h-4 text-green-500" /> Results CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        <FileText className="w-4 h-4 text-red-500" /> PDF Report
                    </Button>
                </CardContent>
            </Card>

            {/* App Integrations */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-purple-400" /> App Ecosystem
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-between border border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white hover:border-blue-500/50 group">
                        <span>Send to EarthModel Pro</span>
                        <Share2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between border border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white hover:border-blue-500/50 group">
                        <span>Send to FDP Accelerator</span>
                        <Share2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between border border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white hover:border-blue-500/50 group">
                        <span>Send to NPV Builder</span>
                        <Share2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default ExportLinksTab;