import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, FilePieChart, FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { generateAFESummaryPDF, exportToExcel } from '@/utils/afeServices';

const ReportCard = ({ title, description, icon: Icon, onGenerate, onExcel }) => (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
        <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-800 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">{description}</p>
            <div className="flex gap-2">
                <Button onClick={onGenerate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs">
                    <Download className="w-3 h-3 mr-2" /> PDF
                </Button>
                {onExcel && (
                    <Button onClick={onExcel} variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                        <FileSpreadsheet className="w-3 h-3 mr-2" /> Excel
                    </Button>
                )}
            </div>
        </CardContent>
    </Card>
);

const ReportingEngine = ({ afe, costItems }) => {
  
  const handleSummaryReport = () => {
      // Mock partners data if not passed or use default
      const partners = [{name: 'Partner A', working_interest: 30}, {name: 'Partner B', working_interest: 10}];
      generateAFESummaryPDF(afe, costItems, partners);
  };

  const handleExcelExport = () => {
      const data = costItems.map(item => ({
          Code: item.code,
          Description: item.description,
          Category: item.category,
          Budget: item.budget,
          Actual: item.actual,
          Variance: (item.budget - item.actual),
          Vendor: item.vendor
      }));
      exportToExcel(data, `AFE_Cost_Export_${afe.afe_number}`);
  };

  return (
    <div className="space-y-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">Reporting Engine</h2>
            <p className="text-slate-400">Generate standard reports, billing statements, and data exports for AFE {afe.afe_number}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                title="AFE Executive Summary" 
                description="High-level overview of budget vs actuals, major variances, and forecast at completion."
                icon={FileBarChart}
                onGenerate={handleSummaryReport}
                onExcel={handleExcelExport}
            />
            <ReportCard 
                title="Period Cost Report" 
                description="Detailed cost breakdown for the current accounting period, suitable for month-end accruals."
                icon={Calendar}
                onGenerate={() => alert('Period Cost Report generation started...')}
                onExcel={() => handleExcelExport()}
            />
            <ReportCard 
                title="Partner Billing Pack" 
                description="Consolidated billing statements and backup documentation for all JV partners."
                icon={FilePieChart}
                onGenerate={() => alert('Partner Pack generation started...')}
            />
            <ReportCard 
                title="Variance Analysis" 
                description="Deep dive into line items with >10% variance, including commentary and root cause."
                icon={FileBarChart}
                onGenerate={() => alert('Variance Analysis generation started...')}
                onExcel={() => handleExcelExport()}
            />
        </div>
    </div>
  );
};

export default ReportingEngine;