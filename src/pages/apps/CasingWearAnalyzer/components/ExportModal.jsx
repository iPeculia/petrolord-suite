import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, FileText, Briefcase, FileWarning } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExportModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  
  const handleExport = (type) => {
    toast({
      title: `Exporting to ${type}...`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Share2 className="w-5 h-5 text-amber-400" /> Export Analysis</DialogTitle>
          <DialogDescription className="text-slate-400">
            Export wear analysis results to other Petrolord applications or as a standalone report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white" onClick={() => handleExport("Casing & Tubing Design Pro")}>
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span className="text-xs">Casing & Tubing Design Pro</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white" onClick={() => handleExport("Project Management Pro")}>
            <FileWarning className="w-6 h-6 text-orange-400" />
            <span className="text-xs">Project Management Pro</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white" onClick={() => handleExport("AFE & Cost Manager")}>
            <FileText className="w-6 h-6 text-emerald-400" />
            <span className="text-xs">AFE & Cost Manager</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white" onClick={() => handleExport("PDF Report")}>
            <FileText className="w-6 h-6 text-red-400" />
            <span className="text-xs">PDF Report</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;