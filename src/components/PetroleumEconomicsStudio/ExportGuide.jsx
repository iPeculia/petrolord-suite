import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileSpreadsheet, FileText, Code } from 'lucide-react';

const ExportGuide = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Options Guide</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="excel" className="mt-2">
            <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="excel"><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</TabsTrigger>
                <TabsTrigger value="pdf"><FileText className="w-4 h-4 mr-2" /> PDF</TabsTrigger>
                <TabsTrigger value="json"><Code className="w-4 h-4 mr-2" /> JSON</TabsTrigger>
            </TabsList>

            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 min-h-[200px]">
                <TabsContent value="excel" className="mt-0 space-y-3">
                    <h3 className="font-semibold text-emerald-400">Excel Workbook (.xlsx)</h3>
                    <p className="text-sm text-slate-400">Best for: Detailed analysis, sharing raw data, and offline editing.</p>
                    <ul className="text-sm text-slate-400 list-disc pl-5 space-y-1">
                        <li>Includes separate sheets for Inputs, Cashflow, and Scenarios.</li>
                        <li>Formulas are flattened to values (no live calculation logic).</li>
                        <li>Formatted for immediate printing or pivot tables.</li>
                    </ul>
                </TabsContent>
                <TabsContent value="pdf" className="mt-0 space-y-3">
                    <h3 className="font-semibold text-red-400">PDF Report (.pdf)</h3>
                    <p className="text-sm text-slate-400">Best for: Executive summaries, presentations, and non-editable sharing.</p>
                    <ul className="text-sm text-slate-400 list-disc pl-5 space-y-1">
                        <li>Includes KPI dashboard summary.</li>
                        <li>Visual charts for Production and Cashflow.</li>
                        <li>Standardized "Investment Memo" format.</li>
                    </ul>
                </TabsContent>
                <TabsContent value="json" className="mt-0 space-y-3">
                    <h3 className="font-semibold text-blue-400">JSON Data (.json)</h3>
                    <p className="text-sm text-slate-400">Best for: System integration, API payloads, and archival.</p>
                    <ul className="text-sm text-slate-400 list-disc pl-5 space-y-1">
                        <li>Full structured object of the active scenario.</li>
                        <li>Machine-readable format.</li>
                        <li>Includes metadata and timestamp.</li>
                    </ul>
                </TabsContent>
            </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExportGuide;