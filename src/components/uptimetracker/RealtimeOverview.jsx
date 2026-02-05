import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { TrendingUp, BarChart, Clock, AlertTriangle } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, TimeScale);

const KPI_CARDS = [
  { key: 'uptime_24h', label: 'Uptime (24h)', icon: TrendingUp },
  { key: 'lost_barrels_24h', label: 'Lost Barrels (24h)', icon: BarChart },
  { key: 'downtime_duration_24h', label: 'Downtime (24h)', icon: Clock },
  { key: 'downtime_events_24h', label: 'Downtime Events (24h)', icon: AlertTriangle },
];

const RealtimeOverview = ({ kpis, trendData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#e2e8f0' } },
      title: { display: false },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Production (STB/day)', color: '#e2e8f0' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        title: { display: true, text: 'Uptime (%)', color: '#e2e8f0' },
        ticks: { color: '#94a3b8' },
        grid: { drawOnChartArea: false },
      },
    },
  };
  
  const chartData = {
    labels: trendData.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Production (STB/day)',
        data: trendData.production,
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgba(52, 211, 153, 1)',
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Uptime (%)',
        data: trendData.uptime,
        borderColor: 'rgba(251, 191, 36, 1)',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        tension: 0.3,
        fill: true,
        yAxisID: 'y2',
      },
    ],
  };

  return (
    <CollapsibleSection title="Real-time Monitoring & Overview" icon={<TrendingUp />} defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI_CARDS.map(({ key, label, icon: Icon }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 p-4 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-6 h-6 text-lime-300" />
              <p className="text-sm text-lime-200">{label}</p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">{kpis[key]}</p>
          </motion.div>
        ))}
      </div>
      <div className="h-96 bg-white/5 p-4 rounded-lg">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </CollapsibleSection>
  );
};

export default RealtimeOverview;