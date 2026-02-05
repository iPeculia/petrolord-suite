import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Line } from 'react-chartjs-2';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { AlertTriangle, BrainCircuit, Loader2, Zap } from 'lucide-react';

    const chartOptionsBase = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: '#fff' } },
      },
      scales: {
        x: { ticks: { color: '#a3e635' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        y: { ticks: { color: '#a3e635' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      }
    };

    const AnomalyDetectionPanel = ({ rawData }) => {
      const [settings, setSettings] = useState({
        focusVariable: 'inj_bpd',
        detectionMethod: 'spc',
        spcStdDevs: 3,
      });
      const [results, setResults] = useState(null);
      const [loading, setLoading] = useState(false);
      const { toast } = useToast();

      const handleRun = async () => {
        if (!rawData) {
          toast({ title: "No Data", description: "Please run a primary analysis first to load data.", variant: "destructive" });
          return;
        }
        setLoading(true);
        setResults(null);
        try {
          const payload = {
            data: rawData.rows || [],
            config: settings,
          };
          const { data, error } = await supabase.functions.invoke('waterflood-engine', {
            body: { action: 'run_anomaly_detection', payload }
          });

          if (error) throw new Error(`Edge Function Error: ${error.message}`);
          if (data.error) throw new Error(data.error);

          setResults(data);
          toast({ title: "Anomaly Detection Complete!", description: `${data.summary.totalAnomalies} anomalies found.` });
        } catch (error) {
          toast({ title: "Anomaly Detection Failed", description: error.message, variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };

      const AnomalyChart = () => {
        if (!results) return null;

        const chartData = {
          labels: results.timeSeries.map(d => d.date),
          datasets: [
            {
              label: settings.focusVariable,
              data: results.timeSeries.map(d => d[settings.focusVariable]),
              borderColor: '#a3e635',
              tension: 0.1,
            },
            {
              label: 'Anomaly',
              data: results.timeSeries.map(d => d.is_anomaly ? d[settings.focusVariable] : null),
              borderColor: '#f87171',
              backgroundColor: '#f87171',
              type: 'scatter',
              radius: 5,
            }
          ]
        };

        return <div className="h-80"><Line options={chartOptionsBase} data={chartData} /></div>;
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 p-4 rounded-lg mt-6"
        >
          <h3 className="text-xl font-bold text-lime-300 flex items-center mb-4"><Zap className="w-5 h-5 mr-2" />AI Anomaly Detection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Focus Variable</Label>
              <Select value={settings.focusVariable} onValueChange={(v) => setSettings(s => ({...s, focusVariable: v}))}>
                <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inj_bpd">Injection (BPD)</SelectItem>
                  <SelectItem value="prod_bopd">Oil Prod (BOPD)</SelectItem>
                  <SelectItem value="prod_bwpd">Water Prod (BWPD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Method</Label>
              <Select value={settings.detectionMethod} onValueChange={(v) => setSettings(s => ({...s, detectionMethod: v}))}>
                <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="spc">SPC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRun} disabled={loading} className="self-end">
              {loading ? <Loader2 className="animate-spin" /> : 'Run Detection'}
            </Button>
          </div>

          {results && (
            <div className="space-y-4">
              <AnomalyChart />
              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Well</TableHead><TableHead>Variable</TableHead><TableHead>Value</TableHead><TableHead>Reason</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {results.anomalies.map((a, i) => (
                      <TableRow key={i} className="bg-red-900/30">
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.well}</TableCell>
                        <TableCell>{a.variable}</TableCell>
                        <TableCell>{a.value.toFixed(2)}</TableCell>
                        <TableCell>{a.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </motion.div>
      );
    };

    export default AnomalyDetectionPanel;