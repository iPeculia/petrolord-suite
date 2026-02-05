import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import EmptyState from './EmptyState';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OutputDisplay = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Generating Program...</p>
            <p className="text-lime-300">The AI is crunching the numbers.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return <EmptyState />;
  }
  
  const directionalPlotData = {
    labels: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500].map(d => `${d}m`),
    datasets: [{
      label: 'Well Trajectory',
      data: [
        { x: 0, y: 0 }, { x: 0, y: 500 }, { x: 0, y: 1000 }, { x: 0, y: 1500 },
        { x: 150, y: 2000 }, { x: 400, y: 2500 }, { x: 700, y: 3000 },
        { x: 1100, y: 3500 }, { x: 1500, y: 4000 }, { x: 1900, y: 4500 }
      ],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Planned Directional Profile', color: 'white', font: { size: 16 } },
    },
    scales: {
      y: { 
        title: { display: true, text: 'True Vertical Depth (m)', color: 'white' },
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        reverse: true,
      },
      x: { 
        title: { display: true, text: 'Horizontal Displacement (m)', color: 'white' },
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Program Ready!</h2>
        <p className="text-lime-200 mb-4">Your drilling program has been successfully generated.</p>
        <Button asChild className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600">
          <a href={result.downloadUrl} download>
            <Download className="w-4 h-4 mr-2" />
            Download Program (PDF)
          </a>
        </Button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-black/20 p-3 rounded-md">
            <p className="text-lime-300 text-sm">Well Name</p>
            <p className="text-white font-bold">{result.summary.wellName}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-md">
            <p className="text-lime-300 text-sm">Total Depth (m)</p>
            <p className="text-white font-bold">{result.summary.totalDepth}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-md">
            <p className="text-lime-300 text-sm">Casing Points</p>
            <p className="text-white font-bold">{result.summary.casingPoints}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-md">
            <p className="text-lime-300 text-sm">Fluid Stages</p>
            <p className="text-white font-bold">{result.summary.fluidStages}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="h-96">
            <Line options={chartOptions} data={directionalPlotData} />
        </div>
      </div>
    </motion.div>
  );
};

export default OutputDisplay;