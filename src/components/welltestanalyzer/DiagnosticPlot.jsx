import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, zoomPlugin);

const DiagnosticPlot = ({ title, data, chartRef }) => {
  const chartData = {
    datasets: [
      {
        label: 'ΔP (Pressure Change)',
        data: data.deltaP,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointStyle: 'circle',
        radius: 3,
        yAxisID: 'y',
      },
      {
        label: 'Pressure Derivative',
        data: data.smoothedDerivative || data.derivative,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        pointStyle: 'triangle',
        radius: 4,
        yAxisID: 'y',
      },
      {
        label: 'Model Fit (Derivative)',
        data: data.modelFit,
        borderColor: 'rgba(52, 211, 153, 1)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        type: 'line',
        showLine: true,
        yAxisID: 'y',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#1f2937' }
      },
      title: {
        display: true,
        text: title,
        color: '#1f2937',
        font: { size: 16 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          drag: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        type: 'logarithmic',
        title: { text: 'Time (hours)', display: true, color: '#4b5563' },
        ticks: { color: '#4b5563' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      y: {
        type: 'logarithmic',
        title: { text: 'ΔP & Derivative (psi)', display: true, color: '#4b5563' },
        ticks: { color: '#4b5563' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg h-full">
      <Scatter ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default DiagnosticPlot;