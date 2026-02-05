import React from 'react';
    import { Scatter } from 'react-chartjs-2';
    import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

    ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const NodalPlot = ({ data }) => {
      const datasets = [
        {
          label: 'IPR Curve',
          data: data.ipr,
          borderColor: 'rgba(52, 211, 153, 1)',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 0,
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'VLP Curve (Current)',
          data: data.vlp_current,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'VLP Curve (Optimal)',
          data: data.vlp_optimal,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'Predicted Operating Point',
          data: [data.current_point],
          backgroundColor: 'rgba(239, 68, 68, 1)',
          pointRadius: 8,
          pointStyle: 'circle',
        },
        {
          label: 'Optimal Operating Point',
          data: [data.optimal_point],
          backgroundColor: 'rgba(59, 130, 246, 1)',
          pointRadius: 10,
          pointStyle: 'star',
        },
      ];

      if (data.actual_point && data.actual_point.x > 0) {
        datasets.push({
          label: 'Actual Operating Point',
          data: [data.actual_point],
          backgroundColor: 'rgba(250, 204, 21, 1)',
          pointRadius: 10,
          pointStyle: 'crossRot',
          rotation: 45,
        });
      }

      const chartData = { datasets };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#e2e8f0' }
          },
          title: {
            display: true,
            text: 'Nodal Analysis: IPR vs VLP',
            color: '#e2e8f0',
            font: { size: 16 },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += `P: ${context.parsed.y.toFixed(0)} psi, Q: ${context.parsed.x.toFixed(0)} STB/d`;
                }
                return label;
              }
            }
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { text: 'Flow Rate (STB/day)', display: true, color: '#94a3b8' },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          y: {
            title: { text: 'Pressure (psi)', display: true, color: '#94a3b8' },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      };

      return (
        <div className="bg-white/5 p-4 rounded-lg h-[500px]">
          <Scatter data={chartData} options={chartOptions} />
        </div>
      );
    };

    export default NodalPlot;