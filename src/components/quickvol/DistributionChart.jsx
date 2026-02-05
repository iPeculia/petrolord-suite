import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DistributionChart = ({ simulations, percentiles }) => {
  // Extract STOOIP values from simulations
  const stooipValues = simulations.map(sim => sim.stooip);
  
  // Calculate histogram bins (20 equal-width bins)
  const minValue = Math.min(...stooipValues);
  const maxValue = Math.max(...stooipValues);
  const binWidth = (maxValue - minValue) / 20;
  
  // Create bins
  const bins = Array.from({ length: 20 }, (_, i) => ({
    min: minValue + i * binWidth,
    max: minValue + (i + 1) * binWidth,
    count: 0,
    label: `${(minValue + i * binWidth).toFixed(1)} - ${(minValue + (i + 1) * binWidth).toFixed(1)}`
  }));
  
  // Count values in each bin
  stooipValues.forEach(value => {
    const binIndex = Math.min(Math.floor((value - minValue) / binWidth), 19);
    bins[binIndex].count++;
  });
  
  // Prepare chart data
  const chartData = {
    labels: bins.map(bin => bin.label),
    datasets: [
      {
        label: 'Frequency',
        data: bins.map(bin => bin.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Semi-transparent blue
        borderColor: 'rgba(0, 0, 0, 1)', // Black border
        borderWidth: 1,
      }
    ]
  };
  
  // Chart options with P10/P50/P90 lines
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'STOOIP Distribution',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return `Range: ${context[0].label} MMbbl`;
          },
          label: function(context) {
            return `Frequency: ${context.parsed.y} simulations`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'STOOIP (MMbbl)',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#a3e635',
          maxRotation: 45,
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#a3e635',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // Custom plugin to draw P10/P50/P90 lines
  const percentilePlugin = {
    id: 'percentileLines',
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const xScale = chart.scales.x;
      
      // Helper function to get x position for a value
      const getXPosition = (value) => {
        // Find which bin this value falls into
        const binIndex = Math.min(Math.floor((value - minValue) / binWidth), 19);
        const binCenter = minValue + (binIndex + 0.5) * binWidth;
        return xScale.getPixelForValue(bins[binIndex].label);
      };
      
      // Draw P10 line (red)
      const p10X = getXPosition(percentiles.stooip.p10);
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p10X, chartArea.top);
      ctx.lineTo(p10X, chartArea.bottom);
      ctx.stroke();
      
      // P10 label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('P10', p10X, chartArea.top - 10);
      ctx.fillText(percentiles.stooip.p10.toFixed(1), p10X, chartArea.top - 25);
      
      // Draw P50 line (orange)
      const p50X = getXPosition(percentiles.stooip.p50);
      ctx.strokeStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(p50X, chartArea.top);
      ctx.lineTo(p50X, chartArea.bottom);
      ctx.stroke();
      
      // P50 label
      ctx.fillStyle = '#f97316';
      ctx.fillText('P50', p50X, chartArea.top - 10);
      ctx.fillText(percentiles.stooip.p50.toFixed(1), p50X, chartArea.top - 25);
      
      // Draw P90 line (green)
      const p90X = getXPosition(percentiles.stooip.p90);
      ctx.strokeStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(p90X, chartArea.top);
      ctx.lineTo(p90X, chartArea.bottom);
      ctx.stroke();
      
      // P90 label
      ctx.fillStyle = '#22c55e';
      ctx.fillText('P90', p90X, chartArea.top - 10);
      ctx.fillText(percentiles.stooip.p90.toFixed(1), p90X, chartArea.top - 25);
      
      ctx.restore();
    }
  };

  return (
    <div className="h-80 w-full">
      <Bar 
        data={chartData} 
        options={options} 
        plugins={[percentilePlugin]}
      />
    </div>
  );
};

export default DistributionChart;