import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Lightbulb, Wrench } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

const PredictiveInsights = ({ predictiveData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Anomaly Detection in Runtime Hours', color: '#e2e8f0' },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const chartData = {
    labels: predictiveData.labels,
    datasets: [
      {
        label: 'Runtime Hours',
        data: predictiveData.runtime,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Anomalies',
        data: predictiveData.anomalies,
        type: 'scatter',
        backgroundColor: 'rgba(239, 68, 68, 1)',
        radius: 5,
        pointStyle: 'crossRot',
      },
    ],
  };

  return (
    <CollapsibleSection title="Predictive Insights & Recommendations" icon={<Lightbulb />}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-white/5 p-4 rounded-lg">
          <Line options={chartOptions} data={chartData} />
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Wrench className="w-5 h-5 mr-2" /> Maintenance Optimization Suggestions (AI)</h3>
          <ul className="space-y-3 text-sm text-lime-200 list-disc list-inside">
            <li>Increase inspection frequency for Pump P-102 on Platform A.</li>
            <li>Schedule preventative maintenance for Compressor C-05 within the next 7 days.</li>
            <li>Consider replacing valve V-301 on Well-12H due to high cycle count.</li>
          </ul>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default PredictiveInsights;