import React from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Droplets, TestTube, Thermometer, Zap, BarChart, Download, FileText, Atom, GitMerge } from 'lucide-react';
    import CollapsibleSection from './CollapsibleSection';
    import PvtPlot from './PvtPlot';
    import PhaseEnvelopePlot from './PhaseEnvelopePlot';

    const KPICard = ({ label, value, unit, icon: Icon }) => (
      <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-lime-300" />
          <p className="text-sm text-white">{label}</p>
        </div>
        <p className="text-2xl font-bold text-white mt-2 font-mono">
          {value ?? 'N/A'}{' '}
          <span className="text-base text-slate-400">{unit}</span>
        </p>
      </div>
    );

    const ResultsPanel = ({ results }) => {
      const { toast } = useToast();

      if (!results || !results.kpis || !results.table) {
        return (
          <div className="text-center text-slate-400 p-8 bg-red-900/20 border border-red-700 rounded-lg">
            <h3 className="text-xl font-bold text-red-300 mb-2">Results Error</h3>
            <p>Could not process the calculation results.</p>
            <p>The data structure from the API might be incorrect or incomplete.</p>
          </div>
        );
      }
      
      const { kpis, table, notes, phase_envelope } = results;

      const handleExportCsv = () => {
        if (!table || !table.pressure_psi || table.pressure_psi.length === 0) {
          toast({ variant: "destructive", title: "No data to export." });
          return;
        }
        
        const headers = Object.keys(table);
        const numRows = table.pressure_psi.length;
        
        const rows = Array.from({ length: numRows }, (_, i) => 
          headers.map(h => table[h]?.[i] ?? '')
        );

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "pvt_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "CSV Exported Successfully!" });
      };

      const kpiCards = [
        { key: 'pb_psi', label: 'Bubble Point', unit: 'psi', icon: Droplets },
        { key: 'rsb_scf_stb', label: 'Rsb', unit: 'scf/STB', icon: TestTube },
        { key: 'bo_at_pb_rb_stb', label: 'Bo at Pb', unit: 'rb/STB', icon: Thermometer },
        { key: 'z_at_mid_p', label: 'Z at mid P', unit: '', icon: Zap },
        { key: 'bg_at_mid_p', label: 'Bg at mid P', unit: 'rb/scf', icon: Atom },
      ];

      const plots = [
        { title: 'Oil: Rs vs P', yKey: 'rs_scf_stb', yLabel: 'Rs (scf/STB)' },
        { title: 'Oil: Bo vs P', yKey: 'bo_rb_stb', yLabel: 'Bo (rb/STB)' },
        { title: 'Oil: μo vs P', yKey: 'mu_o_cp', yLabel: 'μo (cP)' },
        { title: 'Gas: z vs P', yKey: 'z', yLabel: 'Z-factor' },
        { title: 'Gas: Bg vs P', yKey: 'bg_rb_scf', yLabel: 'Bg (rb/scf)' },
        { title: 'Gas: μg vs P', yKey: 'mu_g_cp', yLabel: 'μg (cP)' },
        { title: 'Water: Bw vs P', yKey: 'bw_rb_stb', yLabel: 'Bw (rb/STB)' },
      ];

      const tableHeaders = table ? Object.keys(table) : [];
      const tableRows = table && table.pressure_psi ? table.pressure_psi.map((_, i) => 
        tableHeaders.map(h => table[h][i])
      ) : [];

      return (
        <div className="space-y-6">
          <CollapsibleSection title="Key PVT Properties" icon={<BarChart />} defaultOpen>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {kpiCards.map(({ key, label, unit, icon }) => (
                <KPICard key={key} label={label} value={kpis[key]?.toFixed(2)} unit={unit} icon={icon} />
              ))}
            </div>
          </CollapsibleSection>

          {phase_envelope && (
            <CollapsibleSection title="P-T Phase Envelope" icon={<GitMerge />} defaultOpen>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <PhaseEnvelopePlot data={phase_envelope} plotId="phase-envelope-plot" />
              </div>
            </CollapsibleSection>
          )}

          <CollapsibleSection title="Interactive PVT Plots" icon={<BarChart />} defaultOpen>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {plots.map(p => (
                table[p.yKey] && (
                  <PvtPlot
                    key={p.title}
                    plotId={`plot-${p.yKey}`}
                    title={p.title}
                    pressureData={table.pressure_psi}
                    yData={table[p.yKey]}
                    yAxisTitle={p.yLabel}
                    bubblePoint={kpis.pb_psi}
                  />
                )
              ))}
            </div>
          </CollapsibleSection>
          
          {notes && notes.length > 0 && (
            <CollapsibleSection title="Notes" icon={FileText}>
              <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-lg">
                <ul className="list-disc list-inside text-yellow-200 space-y-1 font-mono text-sm">
                  {notes.map((note, i) => <li key={i}>{note}</li>)}
                </ul>
              </div>
            </CollapsibleSection>
          )}

          <CollapsibleSection title="PVT Data Table" icon={<FileText />} defaultOpen>
            <div className="bg-white/5 border border-white/10 rounded-lg max-h-96 overflow-y-auto">
              <table className="w-full text-sm text-left text-white">
                  <thead className="text-xs text-lime-300 uppercase bg-black/20 sticky top-0">
                      <tr>
                          {tableHeaders.map(key => <th key={key} scope="col" className="px-4 py-2 font-mono">{key.replace(/_/g, ' ')}</th>)}
                      </tr>
                  </thead>
                  <tbody>
                      {tableRows.map((row, index) => (
                          <tr key={index} className="border-b border-white/10 hover:bg-white/10">
                              {row.map((val, i) => <td key={i} className="px-4 py-2 whitespace-nowrap font-mono">{typeof val === 'number' ? val.toFixed(4) : val}</td>)}
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Export Results" icon={<Download />}>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Download Your Analysis</h3>
                <Button variant="outline" onClick={handleExportCsv}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
            </div>
          </CollapsibleSection>
        </div>
      );
    };

    export default ResultsPanel;