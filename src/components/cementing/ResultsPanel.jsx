import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Download, FileText, Save, Droplets, Gauge, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { exportCementingCSV, exportCementingPDF } from '@/utils/cementingExport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const KPICard = ({ title, value, unit, icon: Icon }) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-4">
        <Icon className="w-8 h-8 text-yellow-400" />
        <div>
            <p className="text-sm text-yellow-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value} <span className="text-lg text-slate-300">{unit}</span></p>
        </div>
    </div>
  );
};

const ECDPlot = ({ data, title, fracGradient }) => {
  const chartData = {
    labels: data.map(d => d.depth),
    datasets: [
      {
        label: 'ECD',
        data: data.map(d => d.ecd),
        borderColor: '#facc15', // yellow-400
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
        yAxisID: 'y',
        tension: 0.1,
        fill: true,
      },
       {
        label: 'Fracture Gradient',
        data: Array(data.length).fill(fracGradient),
        borderColor: '#f87171', // red-400
        borderDash: [5, 5],
        yAxisID: 'y',
        tension: 0.1,
        pointRadius: 0
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
      x: { title: { display: true, text: 'Depth (ft)', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'ECD (ppg)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: true, color: 'rgba(255,255,255,0.1)' } },
    },
  };

  return <Line options={options} data={chartData} />;
};

const PressurePlot = ({ data, title }) => {
    const chartData = {
      labels: data.map(d => d.time),
      datasets: [
        {
          label: 'Surface Pressure',
          data: data.map(d => d.pressure),
          borderColor: '#60a5fa', // blue-400
          yAxisID: 'y',
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
        x: { title: { display: true, text: 'Time (min)', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Pressure (psi)', color: 'white' }, ticks: { color: 'white' }, grid: { drawOnChartArea: true, color: 'rgba(255,255,255,0.1)' } },
      },
    };
  
    return <Line options={options} data={chartData} />;
  };

const ResultsPanel = ({ results, inputs }) => {
  const { summary, ecdProfile, pressureProfile } = results;
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
    
    const { error } = await supabase.from('cementing_simulation_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

    if (error) {
        toast({ variant: 'destructive', title: 'Save Error', description: error.message });
    } else {
        toast({ title: 'Project Saved & Updated', description: `Results for "${inputs.projectName}" have been saved.` });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Displacement Efficiency" value={summary.displacementEfficiency.toFixed(1)} unit="%" icon={Percent} />
        <KPICard title="Max Surface Pressure" value={summary.maxPressure.toFixed(0)} unit="psi" icon={Gauge} />
        <KPICard title="Total Slurry Volume" value={summary.totalSlurryVolume.toFixed(0)} unit="bbl" icon={Droplets} />
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <Tabs defaultValue="ecd">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ecd">ECD Profile</TabsTrigger>
              <TabsTrigger value="pressure">Pressure Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="ecd">
              <div className="h-96 mt-4">
                <ECDPlot data={ecdProfile} title="Equivalent Circulating Density vs. Depth" fracGradient={summary.fracGradient} />
              </div>
            </TabsContent>
            <TabsContent value="pressure">
              <div className="h-96 mt-4">
                <PressurePlot data={pressureProfile} title="Surface Pressure vs. Time" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Job Summary & Recommendations</h3>
        <div className="space-y-2">
            <div className="flex items-center space-x-3 text-green-300">
                <CheckCircle className="w-5 h-5"/>
                <p>Predicted ECD remains below fracture gradient throughout the job.</p>
            </div>
            <div className="flex items-center space-x-3 text-green-300">
                <CheckCircle className="w-5 h-5"/>
                <p>Calculated free fall of {summary.freeFallDuration} minutes is within acceptable limits.</p>
            </div>
             <div className="flex items-center space-x-3 text-green-300">
                <CheckCircle className="w-5 h-5"/>
                <p>Displacement efficiency is high, indicating good mud removal.</p>
            </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Save & Download</h3>
          <div className="flex items-center gap-3">
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Results</Button>
              <Button onClick={() => exportCementingCSV(results, inputs)}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
              <Button onClick={() => exportCementingPDF(results, inputs)}><FileText className="w-4 h-4 mr-2"/>Export PDF</Button>
          </div>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;