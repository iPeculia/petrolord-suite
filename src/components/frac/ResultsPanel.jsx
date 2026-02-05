import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Save, Maximize, TrendingUp, Droplets, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { exportFracCSV, exportFracPDF } from '@/utils/fracExport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const KPICard = ({ title, value, unit, icon: Icon }) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-4">
        <Icon className="w-8 h-8 text-rose-400" />
        <div>
            <p className="text-sm text-rose-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value} <span className="text-lg text-slate-300">{unit}</span></p>
        </div>
    </div>
  );
};

const FracPlot = ({ data, title, yAxisLabel }) => {
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: 'Treatment Pressure',
        data: data.map(d => d.pressure),
        borderColor: '#f43f5e', // rose-500
        yAxisID: 'y',
        tension: 0.2,
      },
       {
        label: 'Slurry Rate',
        data: data.map(d => d.rate),
        borderColor: '#93c5fd', // blue-300
        yAxisID: 'y1',
        tension: 0.2,
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
      x: { title: { display: true, text: 'Time (min)', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Pressure (psi)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: true, color: 'rgba(255,255,255,0.1)' } },
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Rate (bpm)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: false } },
    },
  };

  return <Line options={options} data={chartData} />;
};


const ResultsPanel = ({ results, inputs }) => {
  const { summary, treatmentPlot } = results;
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
    
    const { error } = await supabase.from('frac_completion_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

    if (error) {
        toast({ variant: 'destructive', title: 'Save Error', description: error.message });
    } else {
        toast({ title: 'Project Saved & Updated', description: `Results for "${inputs.projectName}" have been saved.` });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Fracture Half-Length" value={summary.fracHalfLength.toFixed(0)} unit="ft" icon={Maximize} />
        <KPICard title="Avg. Conductivity" value={summary.avgConductivity.toFixed(0)} unit="mD-ft" icon={Wind} />
        <KPICard title="IP30" value={summary.ip30.toFixed(0)} unit="bbl/d" icon={TrendingUp} />
        <KPICard title="Total Proppant" value={summary.totalProppant.toFixed(1)} unit="M lbs" icon={Droplets} />
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="h-96 mt-4">
              <FracPlot data={treatmentPlot} title="Job Treatment Plot" />
          </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Save & Download Analysis</h3>
          <div className="flex items-center gap-3">
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Results</Button>
              <Button onClick={() => exportFracCSV(results, inputs)}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
              <Button onClick={() => exportFracPDF(results, inputs)}><FileText className="w-4 h-4 mr-2"/>Export PDF</Button>
          </div>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;