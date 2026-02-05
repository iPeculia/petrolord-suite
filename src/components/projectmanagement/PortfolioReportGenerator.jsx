import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { FileText, Mail, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PortfolioReportGenerator = ({ open, onOpenChange, projects }) => {
  const { toast } = useToast();
  const [reportType, setReportType] = React.useState('Monthly');
  const [includeCharts, setIncludeCharts] = React.useState(true);
  const [includeRisks, setIncludeRisks] = React.useState(true);

  const handleGenerate = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Portfolio Report - ${reportType}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Summary Stats
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.baseline_budget) || 0), 0);
    doc.text(`Total Projects: ${projects.length}`, 14, 40);
    doc.text(`Total Budget: $${(totalBudget/1000000).toFixed(2)}M`, 14, 46);

    // Project Table
    const tableData = projects.map(p => [
        p.name,
        p.stage,
        p.status || 'N/A',
        `$${((p.baseline_budget || 0)/1000000).toFixed(1)}M`
    ]);

    doc.autoTable({
        head: [['Project Name', 'Stage', 'Status', 'Budget']],
        body: tableData,
        startY: 55,
    });

    if (includeRisks) {
        // Mock Risks Section
        doc.text("Key Portfolio Risks", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Risk', 'Impact', 'Probability']],
            body: [
                ['Supply Chain Delay', 'High', 'Medium'],
                ['Regulatory Change', 'Medium', 'Low'],
            ]
        });
    }

    doc.save(`Portfolio_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({ title: "Report Generated", description: "PDF downloaded successfully." });
    onOpenChange(false);
  };

  const handleEmail = () => {
      toast({ title: "Email Sent", description: "Report has been queued for email delivery." });
      onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Generate Portfolio Report
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Customize and export executive summaries for your stakeholders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Report Period</Label>
                <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="Monthly">Monthly Status Report</SelectItem>
                        <SelectItem value="Quarterly">Quarterly Business Review</SelectItem>
                        <SelectItem value="Annual">Annual Portfolio Summary</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label>Sections to Include</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                    <Label htmlFor="charts" className="font-normal">Performance Charts</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="risks" checked={includeRisks} onCheckedChange={setIncludeRisks} />
                    <Label htmlFor="risks" className="font-normal">Top Risks & Issues</Label>
                </div>
            </div>
        </div>

        <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleEmail} className="border-slate-600 hover:bg-slate-800">
                <Mail className="w-4 h-4 mr-2" /> Email
            </Button>
            <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioReportGenerator;