import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const HallPlotPanel = ({ data, alerts }) => {
  const [selectedInjectors, setSelectedInjectors] = useState(data.slice(0, 3).map(d => d.injector));

  const handleInjectorToggle = (injector) => {
    setSelectedInjectors(prev => 
      prev.includes(injector) ? prev.filter(i => i !== injector) : [...prev, injector]
    );
  };

  const colors = ['#4ade80', '#60a5fa', '#f87171', '#fb923c', '#a78bfa', '#f472b6'];

  const chartData = {
    datasets: data
      .filter(d => selectedInjectors.includes(d.injector))
      .map((injectorData, index) => ({
        label: `${injectorData.injector} (Slope: ${injectorData.slope_last?.toFixed(2) || 'N/A'})`,
        data: injectorData.hall_integral.map((integral, i) => ({
          x: integral,
          y: injectorData.cum_injection[i]
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '1A',
        pointRadius: 1,
        tension: 0.1,
      }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: { display: true, text: 'Hall Plot', color: '#fff', font: { size: 16 } }
    },
    scales: {
      x: { title: { display: true, text: 'Hall Integral', color: '#fff' }, ticks: { color: '#a3e635' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { title: { display: true, text: 'Cumulative Injection (bbl)', color: '#fff' }, ticks: { color: '#a3e635' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    }
  };

  const injectivityIssues = alerts?.injectivity_issue || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Hall Plot Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-white mb-2">Select Injectors:</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {data.map(d => (
              <div key={d.injector} className="flex items-center space-x-2 bg-white/5 p-2 rounded-md">
                <Checkbox
                  id={`check-${d.injector}`}
                  checked={selectedInjectors.includes(d.injector)}
                  onCheckedChange={() => handleInjectorToggle(d.injector)}
                />
                <Label htmlFor={`check-${d.injector}`} className="flex-grow">{d.injector}</Label>
                {injectivityIssues.some(issue => issue.injector === d.injector) && (
                  <Badge variant="destructive">Injectivity Issue</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-3 h-96 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default HallPlotPanel;