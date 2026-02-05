import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { GitCommit, TrendingDown, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const PerformanceAnalytics = ({ paretoData, varianceData }) => {
  if (!paretoData || !varianceData) {
    return <div className="text-center text-lime-300 p-8">Run an analysis to view performance analytics.</div>;
  }
  
  const paretoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Downtime by Reason (Pareto)', color: '#e2e8f0' },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { title: { display: true, text: 'Downtime Hours', color: '#e2e8f0' }, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    },
  };

  const paretoChartData = {
    labels: paretoData.labels,
    datasets: [{
      label: 'Downtime Hours',
      data: paretoData.data,
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 1,
    }],
  };
  
  const varianceOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { display: true, labels: {color: '#e2e8f0'} },
          title: { display: true, text: 'Production vs. Target', color: '#e2e8f0' },
      },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        y: { title: { display: true, text: 'Oil Rate (stb/d)', color: '#e2e8f0' }, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      }
  }
  
  const varianceChartData = {
      labels: varianceData.labels,
      datasets: [
          {
              label: 'Actual Production',
              data: varianceData.actual,
              borderColor: 'rgb(52, 211, 153)',
              backgroundColor: 'rgba(52, 211, 153, 0.5)',
              type: 'bar',
          },
          {
              label: 'Target Production',
              data: varianceData.target,
              borderColor: 'rgb(251, 191, 36)',
              tension: 0.1,
              type: 'line',
          }
      ]
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-lime-300">Downtime Analysis</CardTitle>
                    <CardDescription>Identifying the biggest sources of production losses.</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                    <Bar options={paretoOptions} data={paretoChartData} />
                </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-lime-300">Variance Analysis (Last 7 Days)</CardTitle>
                    <CardDescription>Comparison of actual production against targets.</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                    <Bar options={varianceOptions} data={varianceChartData} />
                </CardContent>
            </Card>
        </div>
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader><CardTitle className="text-lime-300">Key Performance Indicators</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 flex items-center"><GitCommit className="mr-2"/> Conformance to Plan</p>
                    <p className="text-2xl font-bold text-white">92.1%</p>
                </div>
                 <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 flex items-center"><TrendingDown className="mr-2"/> Water Cut (Avg)</p>
                    <p className="text-2xl font-bold text-white">34.5%</p>
                </div>
                 <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 flex items-center"><TrendingUp className="mr-2"/> GOR (Avg)</p>
                    <p className="text-2xl font-bold text-white">1,250 scf/stb</p>
                </div>
                 <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 flex items-center"><TrendingUp className="mr-2"/> Uptime (30d)</p>
                    <p className="text-2xl font-bold text-white">96.8%</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default PerformanceAnalytics;