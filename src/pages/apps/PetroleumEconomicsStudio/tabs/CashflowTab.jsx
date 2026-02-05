import React, { useState, useMemo } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Download, Info, Calculator, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CashflowTab = () => {
  const { calculationResults, modelSettings, loading } = usePetroleumEconomics();
  
  // Toggles State
  const [viewMode, setViewMode] = useState('nominal'); // 'nominal' | 'real'
  const [currency, setCurrency] = useState(modelSettings.currency || 'USD');
  const [explainRow, setExplainRow] = useState(null);

  // Formatting Helper
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    // Simplified formatting: millions/thousands check if needed, but assuming raw numbers are full values.
    // If numbers are large, maybe display in Millions (MM)?
    // Usually Excel tables show full numbers with separators.
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Explanation Definitions
  const rowExplanations = {
    gross_revenue: {
      title: 'Gross Revenue',
      formula: 'Oil Vol × Oil Price + Gas Vol × Gas Price',
      desc: 'Total revenue generated from all hydrocarbon streams before any deductions.'
    },
    royalties: {
      title: 'Royalties',
      formula: 'Gross Revenue × Royalty Rate',
      desc: 'Share of production or revenue paid to the resource owner (government) off the top.'
    },
    opex: {
      title: 'Operating Expenditure (OPEX)',
      formula: 'Fixed Costs + (Variable Cost/unit × Production)',
      desc: 'Day-to-day costs of operating and maintaining the asset.'
    },
    capex: {
      title: 'Capital Expenditure (CAPEX)',
      formula: 'Drilling + Facilities + Abandonment + Other',
      desc: 'Investments in long-term assets such as wells and infrastructure.'
    },
    recoverable_cost: {
      title: 'Recoverable Cost',
      formula: 'Min(Cost Pool, Revenue × Cost Recovery Limit)',
      desc: 'Amount of revenue used to reimburse the contractor for approved costs (PSC regimes only).'
    },
    profit_share: {
      title: 'Contractor Profit Share',
      formula: '(Net Revenue - Recovered Cost) × Contractor Split',
      desc: 'Share of remaining profit oil allocated to the contractor (PSC regimes).'
    },
    taxable_income: {
      title: 'Taxable Income',
      formula: 'Revenue - Royalties - OPEX - Depreciation - Abandonment',
      desc: 'Net income subject to corporate income tax.'
    },
    tax: {
      title: 'Corporate Tax',
      formula: 'Taxable Income × Tax Rate',
      desc: 'Direct tax levied on the project profits.'
    },
    govt_take: {
      title: 'Government Take',
      formula: 'Royalties + Tax + Govt Profit Share',
      desc: 'Total share of economic rent captured by the government.'
    },
    net_cashflow: {
      title: 'Net Cashflow',
      formula: 'Revenue - Royalties - Costs - Tax - Govt Share',
      desc: 'Final cash available to the investor after all obligations.'
    },
    cumulative_cashflow: {
      title: 'Cumulative Cashflow',
      formula: 'Sum(Net Cashflow from start to current year)',
      desc: 'Running total of net cashflow over time.'
    }
  };

  // Process Data based on toggles
  const processedData = useMemo(() => {
    if (!calculationResults || !calculationResults.annualResults) return null;

    const baseYear = modelSettings.startYear;
    const inflationRate = modelSettings.inflationRate || 0.02;

    return calculationResults.annualResults.map(row => {
      const yearIndex = row.year - baseYear;
      const deflator = viewMode === 'real' ? Math.pow(1 + inflationRate, yearIndex) : 1;

      // Helper to transform value
      const t = (val) => (val || 0) / deflator;

      return {
        ...row,
        gross_revenue: t(row.gross_revenue),
        royalties: t(row.royalties),
        opex: t(row.opex),
        capex: t(row.capex),
        recoverable_cost: t(row.recoverable_cost),
        profit_share: t(row.profit_share),
        taxable_income: t(row.taxable_income),
        tax: t(row.tax),
        govt_take: t(row.govt_take),
        net_cashflow: t(row.net_cashflow),
        cumulative_cashflow: t(row.cumulative_cashflow),
      };
    });
  }, [calculationResults, viewMode, modelSettings.startYear, modelSettings.inflationRate]);

  if (loading && !processedData) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mr-2" /> Generating Cashflow Table...
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No results available. Please run the model first.
      </div>
    );
  }

  const rows = [
    { key: 'gross_revenue', label: 'Gross Revenue' },
    { key: 'royalties', label: 'Royalties' },
    { key: 'opex', label: 'OPEX' },
    { key: 'capex', label: 'CAPEX' },
    { key: 'recoverable_cost', label: 'Recoverable Cost' },
    { key: 'profit_share', label: 'Profit Share' },
    { key: 'taxable_income', label: 'Taxable Income' },
    { key: 'tax', label: 'Tax' },
    { key: 'govt_take', label: 'Government Take' },
    { key: 'net_cashflow', label: 'Net Cashflow', bold: true },
    { key: 'cumulative_cashflow', label: 'Cumulative Cashflow', bold: true, borderTop: true },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Label className="text-slate-400">View Mode:</Label>
            <div className="flex items-center bg-slate-950 p-1 rounded-md border border-slate-800">
              <button 
                onClick={() => setViewMode('nominal')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-colors",
                  viewMode === 'nominal' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Nominal (MOD)
              </button>
              <button 
                onClick={() => setViewMode('real')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-colors",
                  viewMode === 'real' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Real ({modelSettings.startYear})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-slate-400">Currency:</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 h-8 bg-slate-950 border-slate-800 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2 h-8 border-slate-700 bg-slate-800 text-slate-300">
          <Download className="w-3.5 h-3.5" /> Export Excel
        </Button>
      </div>

      {/* Table Container */}
      <Card className="flex-1 bg-slate-900 border-slate-800 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 w-full">
          <div className="min-w-max p-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-slate-900 z-20 text-left p-2 border-b border-slate-700 font-semibold text-slate-300 min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                    Item ({currency} MM)
                  </th>
                  {processedData.map(row => (
                    <th key={row.year} className="p-2 border-b border-slate-700 font-medium text-slate-400 min-w-[100px] text-right">
                      {row.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((rowDef) => (
                  <tr key={rowDef.key} className={cn(
                    "hover:bg-slate-800/50 transition-colors group",
                    rowDef.borderTop && "border-t-2 border-slate-700"
                  )}>
                    {/* Row Header */}
                    <td className={cn(
                      "sticky left-0 bg-slate-900 z-10 p-2 border-b border-slate-800 text-slate-300 flex justify-between items-center group-hover:bg-slate-800/50 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]",
                      rowDef.bold && "font-bold text-white"
                    )}>
                      <span>{rowDef.label}</span>
                      <button 
                        onClick={() => setExplainRow(rowDef)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-blue-400 transition-all"
                        title="Explain Calculation"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Data Cells */}
                    {processedData.map((dataRow) => {
                      const val = dataRow[rowDef.key];
                      const isNegative = val < 0;
                      // Assume values in DB are raw units, convert to MM for display
                      const displayVal = val / 1000000; 
                      
                      return (
                        <td key={dataRow.year} className="p-2 border-b border-slate-800 text-right font-mono">
                          <span className={cn(
                            isNegative ? "text-red-400" : (val > 0 ? "text-emerald-400" : "text-slate-500"),
                            rowDef.bold && "font-bold"
                          )}>
                            {isNegative ? '(' + formatCurrency(Math.abs(displayVal)) + ')' : formatCurrency(displayVal)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      {/* Explanation Modal */}
      <Dialog open={!!explainRow} onOpenChange={() => setExplainRow(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              {rowExplanations[explainRow?.key]?.title || explainRow?.label}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Calculation Logic Trace
            </DialogDescription>
          </DialogHeader>
          
          {explainRow && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Formula</div>
                <div className="font-mono text-sm text-green-400">
                  {rowExplanations[explainRow.key]?.formula || 'Direct Input / Calculation'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-300">Description</div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {rowExplanations[explainRow.key]?.desc || 'Standard economic cashflow line item.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 p-2 bg-blue-900/10 rounded border border-blue-900/20">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Values affected by {viewMode} view settings.</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashflowTab;