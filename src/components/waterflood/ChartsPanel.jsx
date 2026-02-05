import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const ChartsPanel = ({ dailySeries, vrrSeries }) => {
  const [showSmoothed, setShowSmoothed] = useState(true);

  const timeSeriesData = {
    labels: dailySeries.date,
    datasets: [
      { label: 'Injection (bpd)', data: showSmoothed ? dailySeries.inj_bpd_s : dailySeries.inj_bpd, borderColor: 'rgb(6, 182, 212)', backgroundColor: 'rgba(6, 182, 212, 0.1)', yAxisID: 'y', tension: 0.1, pointRadius: 0 },
      { label: 'Oil (bpd)', data: showSmoothed ? dailySeries.oil_bpd_s : dailySeries.oil_bpd, borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.1)', yAxisID: 'y', tension: 0.1, pointRadius: 0 },
      { label: 'Water (bpd)', data: showSmoothed ? dailySeries.water_bpd_s : dailySeries.water_bpd, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', yAxisID: 'y', tension: 0.1, pointRadius: 0 },
      { label: 'Water Cut (%)', data: showSmoothed ? dailySeries.wc_pct_s : dailySeries.wc_pct, borderColor: 'rgb(249, 115, 22)', backgroundColor: 'rgba(249, 115, 22, 0.1)', yAxisID: 'y1', tension: 0.1, pointRadius: 0 },
    ]
  };

  const vrrData = {
    labels: vrrSeries.date,
    datasets: [
      { label: 'Daily VRR', data: vrrSeries.vrr_daily, borderColor: 'rgb(168, 85, 247)', backgroundColor: 'rgba(168, 85, 247, 0.1)', yAxisID: 'y', tension: 0.1, pointRadius: 0 },
      { label: 'Rolling VRR', data: vrrSeries.vrr_rolling, borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', yAxisID: 'y', tension: 0.1, pointRadius: 0 },
    ]
  };

  const timeSeriesOptions = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { ...chartOptionsBase.scales.y, title: { display: true, text: 'Rate (bpd)', color: '#fff' } }, y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Water Cut (%)', color: '#fff' }, ticks: { color: '#a3e635' }, grid: { drawOnChartArea: false } } } };
  const vrrOptions = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { ...chartOptionsBase.scales.y, title: { display: true, text: 'VRR', color: '#fff' } } } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Performance Trends</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Time Series Analysis</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="smooth-toggle" checked={showSmoothed} onCheckedChange={setShowSmoothed} />
              <Label htmlFor="smooth-toggle" className="text-sm">Show Smoothed Data</Label>
            </div>
          </div>
          <div className="h-80"><Line data={timeSeriesData} options={timeSeriesOptions} /></div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Voidage Replacement Ratio (VRR)</h3>
          <div className="h-80"><Line data={vrrData} options={vrrOptions} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChartsPanel;