import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Download, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { exportTorqueDragCSV, exportTorqueDragPDF } from '@/utils/torqueDragExport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const KPICard = ({ title, value, unit }) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg">
        <p className="text-sm text-red-300">{title}</p>
        <p className="text-2xl font-bold text-white">{value} <span className="text-lg text-slate-300">{unit}</span></p>
    </div>
  );
};

const TandDPlot = ({ data, title }) => {
  const chartData = {
    labels: data.map(d => d.md),
    datasets: [
      {
        label: 'Pick-up Weight',
        data: data.map(d => d.pickup),
        borderColor: '#facc15', // yellow-400
        yAxisID: 'y',
        tension: 0.1
      },
      {
        label: 'Slack-off Weight',
        data: data.map(d => d.slackoff),
        borderColor: '#f87171', // red-400
        yAxisID: 'y',
        tension: 0.1
      },
      {
        label: 'Rotary Torque',
        data: data.map(d => d.torque),
        borderColor: '#60a5fa', // blue-400
        yAxisID: 'y1',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      title: { display: true, text: title, color: 'white', font: { size: 16 } },
      legend: { labels: { color: 'white' } },
    },
    scales: {
      x: { title: { display: true, text: 'Measured Depth (ft)', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Hookload (klbs)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: true, color: 'rgba(255,255,255,0.1)' } },
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Torque (kft-lbs)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: false } },
    },
  };

  return <Line options={options} data={chartData} />;
};

const ResultsPanel = ({ results, inputs }) => {
  const { summary, scenarios } = results;
  const availableScenarios = Object.keys(scenarios);
  const { toast } = useToast();

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save.' });
        return;
    }

    const projectData = {
        user_id: user.id,
        project_name: inputs.projectName,
        inputs_data: inputs,
        results_data: results,
        updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('torque_drag_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

    if (error) {
        toast({ variant: 'destructive', title: 'Save Error', description: error.message });
    } else {
        toast({ title: 'Project Saved & Updated', description: `Results for "${inputs.projectName}" have been saved.` });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Max Hookload" value={summary.maxHookload.toFixed(1)} unit="klbs" />
        <KPICard title="Max Torque" value={summary.maxTorque.toFixed(1)} unit="kft-lbs" />
        <KPICard title="Max Drag" value={summary.maxDrag.toFixed(1)} unit="klbs" />
        <div className={`p-4 rounded-lg flex items-center justify-center ${summary.limitsExceeded ? 'bg-red-500/30' : 'bg-green-500/30'}`}>
            <div className="text-center">
                <p className="text-sm text-white">Limits Exceeded?</p>
                <p className="text-2xl font-bold text-white">{summary.limitsExceeded ? 'Yes' : 'No'}</p>
            </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <Tabs defaultValue={availableScenarios[0]}>
            <TabsList className="grid w-full grid-cols-4">
              {availableScenarios.map(scen => <TabsTrigger key={scen} value={scen}>{scen.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TabsTrigger>)}
            </TabsList>
            {availableScenarios.map(scen => (
              <TabsContent key={scen} value={scen}>
                <div className="h-96 mt-4">
                  <TandDPlot data={scenarios[scen]} title={`${scen.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} - T&D Profile`} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recommendations & Warnings</h3>
        <div className="space-y-2">
            {summary.warnings.length > 0 ? summary.warnings.map((warn, i) => (
                <div key={i} className="flex items-start space-x-3 text-yellow-300">
                    <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0"/>
                    <p>{warn}</p>
                </div>
            )) : (
                <div className="flex items-center space-x-3 text-green-300">
                    <CheckCircle className="w-5 h-5"/>
                    <p>All predicted values are within safe operating limits.</p>
                </div>
            )}
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Save Progress & Download Analysis</h3>
          <div className="flex items-center gap-3">
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Results</Button>
              <Button onClick={() => exportTorqueDragCSV(results, inputs)}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
              <Button onClick={() => exportTorqueDragPDF(results, inputs)}><FileText className="w-4 h-4 mr-2"/>Export PDF</Button>
          </div>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;