import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Presentation } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const PrognosisPackExport = () => {
  const handleExport = (format) => {
    // Mock export
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
           <Download className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Export Prognosis Pack</h2>
        <p className="text-slate-400 text-sm">
          Generate a comprehensive report including the Prognosis Chart, Risk Register, and parameter summary.
        </p>

        <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" className="h-24 flex flex-col gap-2 bg-slate-900 border-slate-800 hover:bg-slate-800 hover:text-emerald-400 transition-colors" onClick={() => handleExport('pdf')}>
              <FileText className="w-8 h-8" />
              <span>PDF Report</span>
           </Button>
           <Button variant="outline" className="h-24 flex flex-col gap-2 bg-slate-900 border-slate-800 hover:bg-slate-800 hover:text-orange-400 transition-colors" onClick={() => handleExport('ppt')}>
              <Presentation className="w-8 h-8" />
              <span>PowerPoint</span>
           </Button>
        </div>
        
        <p className="text-xs text-slate-600 mt-8">Includes: Petrolord branding, Well Metadata, Date Stamp</p>
      </div>
    </div>
  );
};

export default PrognosisPackExport;