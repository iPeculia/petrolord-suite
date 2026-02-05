import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { AlertTriangle, CheckCircle, ShieldQuestion, Download, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
// Note: Export functions will be needed here, assuming they exist or will be created
// import { exportStabilityCSV, exportStabilityPDF } from '@/utils/wellboreStabilityExport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const KPICard = ({ title, value, unit, icon: Icon, color }) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
            <p className="text-sm text-purple-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value} <span className="text-lg text-slate-300">{unit}</span></p>
        </div>
    </div>
  );
};

const MudWindowPlot = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.depth),
    datasets: [
      {
        label: 'Collapse Gradient',
        data: data.map(d => d.collapse),
        borderColor: '#f472b6', // pink-400
        yAxisID: 'x',
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Fracture Gradient',
        data: data.map(d => d.fracture),
        borderColor: '#e879f9', // fuchsia-400
        yAxisID: 'x',
        tension: 0.1,
        pointRadius: 0,
        fill: {
            target: '-1',
            above: 'rgba(16, 185, 129, 0.2)', // emerald-500
        },
      },
      {
        label: 'Pore Pressure',
        data: data.map(d => d.porePressure),
        borderColor: '#60a5fa', // blue-400
        yAxisID: 'x',
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      title: { display: true, text: 'Mud Weight Window', color: 'white', font: { size: 16 } },
      legend: { labels: { color: 'white' } },
    },
    scales: {
      y: { 
        title: { display: true, text: 'True Vertical Depth (ft)', color: 'white' }, 
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255,255,255,0.1)' },
        reverse: true,
      },
      x: { 
        title: { display: true, text: 'Equivalent Mud Weight (ppg)', color: 'white' }, 
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255,255,255,0.1)' },
        position: 'top',
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

const ResultsPanel = ({ results, inputs }) => {
  const { summary, plotData, recommendations } = results;
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
    
    const { error } = await supabase.from('geomechanics_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

    if (error) {
        toast({ variant: 'destructive', title: 'Save Error', description: error.message });
    } else {
        toast({ title: 'Project Saved & Updated', description: `Results for "${inputs.projectName}" have been saved.` });
    }
  };

  const handleExport = (type) => {
    toast({
        title: "🚧 Feature Coming Soon!",
        description: `Export to ${type.toUpperCase()} isn't implemented yet.`,
        duration: 4000,
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Narrowest Window" value={summary.narrowestWindow.toFixed(2)} unit="ppg" icon={AlertTriangle} color="text-red-400" />
        <KPICard title="Critical Depth" value={summary.criticalDepth} unit="ft" icon={ShieldQuestion} color="text-yellow-400" />
        <KPICard title="Primary Risk" value={summary.primaryRisk} unit="" icon={summary.primaryRisk === 'Stable' ? CheckCircle : AlertTriangle} color={summary.primaryRisk === 'Stable' ? "text-green-400" : "text-red-400"} />
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[500px]">
        <MudWindowPlot data={plotData} />
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recommendations & Warnings</h3>
        <div className="space-y-2">
            {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-3 text-yellow-300">
                    <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400"/>
                    <p>{rec}</p>
                </div>
            ))}
            {recommendations.length === 0 && (
                 <div className="flex items-center space-x-3 text-green-300">
                    <CheckCircle className="w-5 h-5 text-green-400"/>
                    <p>The proposed well plan appears stable with a wide mud weight window.</p>
                </div>
            )}
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Save & Download</h3>
          <div className="flex items-center gap-3">
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Results</Button>
              <Button onClick={() => handleExport('csv')}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
              <Button onClick={() => handleExport('pdf')}><FileText className="w-4 h-4 mr-2"/>Export PDF</Button>
          </div>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;