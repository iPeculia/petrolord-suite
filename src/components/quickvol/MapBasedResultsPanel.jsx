import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Droplets, Cloud, Layers, FileDown, AlertTriangle, CheckCircle, 
    XCircle, Activity, ChevronDown, ChevronUp, History, ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as XLSX from 'xlsx';

// --- Components ---

const KpiCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className={`bg-white/5 rounded-xl p-4 border-l-4 ${color} flex-1`}>
    <div className="flex justify-between items-start">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      <Icon className="w-5 h-5 text-slate-400" />
    </div>
    <p className="text-2xl font-bold text-white mt-2">{value}</p>
    <p className="text-xs text-slate-400">{unit}</p>
  </div>
);

const ValidationBadge = ({ score }) => {
    let color = "bg-red-500/20 text-red-400 border-red-500/50";
    let icon = <XCircle className="w-3 h-3 mr-1" />;
    let text = "Poor Quality";
    
    if (score >= 90) {
        color = "bg-green-500/20 text-green-400 border-green-500/50";
        icon = <CheckCircle className="w-3 h-3 mr-1" />;
        text = "High Quality";
    } else if (score >= 70) {
        color = "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        icon = <AlertTriangle className="w-3 h-3 mr-1" />;
        text = "Warnings Found";
    }

    return (
        <Badge variant="outline" className={`${color} flex items-center`}>
            {icon} {text} ({score}%)
        </Badge>
    );
};

const AuditLog = ({ logs }) => (
    <ScrollArea className="h-[200px] rounded-md border border-slate-800 bg-black/20 p-4">
        <div className="space-y-4">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs">
                    <div className="flex-none pt-0.5">
                        <History className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-slate-400">
                            <span className="font-medium text-slate-300">{log.action}</span>
                            <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-500">{log.details}</p>
                    </div>
                </div>
            ))}
            {logs.length === 0 && <p className="text-slate-500 text-center py-4">No audit history available.</p>}
        </div>
    </ScrollArea>
);

const MapBasedResultsPanel = ({ results }) => {
  const [showAudit, setShowAudit] = useState(false);
  const { 
      stooip, giip, eur, phase, 
      unit_labels, unit_system,
      intermediates, 
      inputs,
      validation 
  } = results;

  // Format helpers
  const fmt = (n, d=2) => n ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : '-';
  const fmtUnit = (u) => <span className="text-slate-500 text-xs ml-1">{u}</span>;

  // Export Function
  const handleExport = () => {
      const data = [
          ["QuickVol Deterministic Report", ""],
          ["Date", new Date().toLocaleString()],
          ["", ""],
          ["INPUT PARAMETERS", ""],
          ["Method", inputs.mode],
          ["Unit System", unit_system],
          ["Area", inputs.area],
          ["Thickness", inputs.thickness || inputs.avg_thickness],
          ["Porosity (%)", inputs.porosity_pct],
          ["Water Saturation (%)", inputs.sw_pct],
          ["Net-to-Gross (%)", inputs.net_to_gross],
          ["Recovery Factor (%)", inputs.recovery_pct],
          ["Oil FVF", inputs.fv_factor],
          ["", ""],
          ["INTERMEDIATE CALCULATIONS", ""],
          [`Gross Rock Volume (${unit_labels.grv})`, intermediates.grv],
          [`Net Rock Volume (${unit_labels.grv})`, intermediates.nrv],
          [`Pore Volume (${unit_labels.grv})`, intermediates.pv],
          [`HCPV (${unit_labels.grv})`, intermediates.hcpv],
          ["", ""],
          ["FINAL RESULTS", ""],
          [`STOOIP (${unit_labels.stooip})`, stooip],
          [`GIIP (${unit_labels.giip})`, giip],
          [`EUR (${unit_labels.eur})`, eur],
          ["", ""],
          ["VALIDATION SCORE", validation.score + "%"],
          ["Issues Found", validation.issues.length]
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "QuickVol_Results");
      XLSX.writeFile(wb, `QuickVol_Deterministic_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Mock Audit Log (In real app, this would come from props/store)
  const auditLogs = [
      { action: 'Calculation Run', details: `Executed ${inputs.mode} method`, timestamp: new Date().toLocaleTimeString() },
      { action: 'Input Updated', details: 'Porosity changed from 18% to 20%', timestamp: new Date(Date.now() - 100000).toLocaleTimeString() },
      { action: 'Validation Check', details: `Score: ${validation.score}%`, timestamp: new Date().toLocaleTimeString() }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-6"
    >
      {/* --- Validation Dashboard --- */}
      <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-cyan-400" /> Data Quality & Validation
                  </CardTitle>
                  <ValidationBadge score={validation.score} />
              </div>
          </CardHeader>
          <CardContent>
              {validation.issues.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 p-3 rounded border border-green-500/20">
                      <CheckCircle className="w-4 h-4" />
                      All checks passed. Data appears consistent and within normal ranges.
                  </div>
              ) : (
                  <div className="space-y-2">
                      {validation.issues.map((issue, idx) => (
                          <div key={idx} className={`flex items-start gap-2 text-sm p-2 rounded border ${
                              issue.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                          }`}>
                              {issue.type === 'error' ? <XCircle className="w-4 h-4 mt-0.5 flex-none" /> : <AlertTriangle className="w-4 h-4 mt-0.5 flex-none" />}
                              <span><span className="font-semibold capitalize">{issue.field?.replace('_pct','').replace('_',' ')}:</span> {issue.message}</span>
                          </div>
                      ))}
                  </div>
              )}
          </CardContent>
      </Card>

      {/* --- Main Results Card --- */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="p-6 pb-0 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-white flex items-center">
                <Layers className="w-6 h-6 mr-3 text-lime-300" /> Volumetric Report
            </h2>
            <Button variant="outline" size="sm" onClick={handleExport} className="border-white/20 text-white hover:bg-white/10">
                <FileDown className="w-4 h-4 mr-2" /> Export Excel
            </Button>
        </div>

        {/* KPI Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(phase === 'oil' || phase === 'gas_oil') && (
            <KpiCard
              title="STOOIP"
              value={fmt(stooip, 1)}
              unit={unit_labels.stooip}
              icon={Droplets}
              color="border-green-500"
            />
          )}
          {(phase === 'gas' || phase === 'gas_oil') && (
            <KpiCard
              title="GIIP"
              value={fmt(giip, 1)}
              unit={unit_labels.giip}
              icon={Cloud}
              color="border-sky-500"
            />
          )}
          <KpiCard
            title="Est. Ult. Recovery"
            value={fmt(eur, 1)}
            unit={unit_labels.eur}
            icon={Activity}
            color="border-purple-500"
          />
        </div>

        {/* Detailed Table */}
        <div className="border-t border-white/10">
             <Table>
                 <TableHeader className="bg-black/20">
                     <TableRow className="hover:bg-transparent border-white/10">
                         <TableHead className="text-slate-300 w-[40%]">Metric</TableHead>
                         <TableHead className="text-slate-300">Value</TableHead>
                         <TableHead className="text-slate-300 text-right">Unit</TableHead>
                     </TableRow>
                 </TableHeader>
                 <TableBody>
                     {/* Input Section */}
                     <TableRow className="bg-slate-900/30 border-white/5"><TableCell colSpan={3} className="font-semibold text-cyan-400 py-2">Input Parameters</TableCell></TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Area</TableCell>
                         <TableCell className="text-slate-200">{fmt(inputs.area || 0)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_system === 'field' ? 'acres' : 'km²'}</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Thickness (Net)</TableCell>
                         <TableCell className="text-slate-200">{fmt(inputs.thickness || inputs.avg_thickness)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_system === 'field' ? 'ft' : 'm'}</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Porosity</TableCell>
                         <TableCell className="text-slate-200">{fmt(inputs.porosity_pct)}</TableCell>
                         <TableCell className="text-right text-slate-400">%</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Water Saturation</TableCell>
                         <TableCell className="text-slate-200">{fmt(inputs.sw_pct)}</TableCell>
                         <TableCell className="text-right text-slate-400">%</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Recovery Factor</TableCell>
                         <TableCell className="text-slate-200">{fmt(inputs.recovery_pct)}</TableCell>
                         <TableCell className="text-right text-slate-400">%</TableCell>
                     </TableRow>

                     {/* Intermediate Section */}
                     <TableRow className="bg-slate-900/30 border-white/5"><TableCell colSpan={3} className="font-semibold text-cyan-400 py-2">Volumetric Calculations</TableCell></TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Gross Rock Volume (GRV)</TableCell>
                         <TableCell className="text-slate-200">{fmt(intermediates.grv)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_labels.grv}</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Net Rock Volume (NRV)</TableCell>
                         <TableCell className="text-slate-200">{fmt(intermediates.nrv)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_labels.grv}</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Pore Volume (PV)</TableCell>
                         <TableCell className="text-slate-200">{fmt(intermediates.pv)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_labels.grv}</TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-white/5 border-white/5">
                         <TableCell className="font-medium text-slate-300 pl-6">Hydrocarbon Pore Volume (HCPV)</TableCell>
                         <TableCell className="text-slate-200">{fmt(intermediates.hcpv)}</TableCell>
                         <TableCell className="text-right text-slate-400">{unit_labels.grv}</TableCell>
                     </TableRow>

                     {/* Final Results Section */}
                     <TableRow className="bg-slate-900/30 border-white/5"><TableCell colSpan={3} className="font-semibold text-lime-400 py-2">Resources In Place</TableCell></TableRow>
                     {(phase === 'oil' || phase === 'gas_oil') && (
                         <TableRow className="hover:bg-white/5 border-white/5 bg-green-900/10">
                             <TableCell className="font-bold text-white pl-6">STOOIP</TableCell>
                             <TableCell className="text-white font-bold text-lg">{fmt(stooip)}</TableCell>
                             <TableCell className="text-right text-slate-300">{unit_labels.stooip}</TableCell>
                         </TableRow>
                     )}
                     {(phase === 'gas' || phase === 'gas_oil') && (
                         <TableRow className="hover:bg-white/5 border-white/5 bg-sky-900/10">
                             <TableCell className="font-bold text-white pl-6">GIIP</TableCell>
                             <TableCell className="text-white font-bold text-lg">{fmt(giip)}</TableCell>
                             <TableCell className="text-right text-slate-300">{unit_labels.giip}</TableCell>
                         </TableRow>
                     )}
                 </TableBody>
             </Table>
        </div>
      </div>

      {/* --- Audit Trail --- */}
      <Collapsible open={showAudit} onOpenChange={setShowAudit} className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
              <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-0 hover:bg-transparent">
                      <History className="w-4 h-4 mr-2" /> 
                      {showAudit ? "Hide Audit Log" : "Show Audit Log"}
                      {showAudit ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </Button>
              </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
              <div className="p-4 pt-0">
                  <AuditLog logs={auditLogs} />
              </div>
          </CollapsibleContent>
      </Collapsible>

    </motion.div>
  );
};

export default MapBasedResultsPanel;