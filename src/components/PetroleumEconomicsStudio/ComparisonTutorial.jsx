import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Download, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ComparisonTutorial = () => {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("How to Compare Economic Scenarios", 20, 20);
    
    doc.setFontSize(12);
    doc.text("1. Understanding Scenarios", 20, 40);
    doc.setFontSize(10);
    doc.text("Scenarios represent different versions of your project (e.g., High Price vs Low Price).", 20, 50);
    
    doc.setFontSize(12);
    doc.text("2. Key Differences", 20, 70);
    doc.setFontSize(10);
    doc.text("Focus on the delta (change) in NPV. A positive delta means the alternative", 20, 80);
    doc.text("scenario creates more value than the base case.", 20, 85);

    doc.save("Comparison_Tutorial.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          Comparing Scenarios Guide
        </h2>
        <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-700 hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" /> Export Guide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base text-slate-200">The Base Case</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400 space-y-2">
            <p>
              Your primary scenario (usually P50/Best Estimate). All other scenarios are compared relative to this one.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-emerald-400">
              NPV: $100 MM (Baseline)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base text-slate-200">Alternative Case</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400 space-y-2">
            <p>
              A variation with different inputs (e.g., Higher Oil Price). The "Delta" shows the impact of these changes.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-blue-400">
              NPV: $120 MM (<span className="text-emerald-400">+$20 MM Delta</span>)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-200">Interpreting Results</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p><strong className="text-slate-300">Positive Delta:</strong> The change improved project value. Keep this if the input change is realistic.</p>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p><strong className="text-slate-300">Negative Delta:</strong> The change eroded value. This identifies risks to watch out for.</p>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
            <p><strong className="text-slate-300">Sensitivity:</strong> If a small input change causes a large delta, your project is highly sensitive to that variable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTutorial;