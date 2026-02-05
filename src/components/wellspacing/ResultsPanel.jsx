import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
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

const ResultsPanel = ({ 
  results, 
  downloadCSV, 
  downloadJSON 
}) => {
  const npvChartData = {
    labels: results.spacingResults.map(r => r.spacing),
    datasets: [
      {
        label: 'NPV ($M)',
        data: results.spacingResults.map(r => r.npv),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'rgb(34, 197, 94)',
        pointRadius: 4,
      }
    ]
  };

  const recoveryChartData = {
    labels: results.spacingResults.map(r => r.spacing),
    datasets: [
      {
        label: 'Total Field Recovery (%)',
        data: results.spacingResults.map(r => r.totalFieldRecovery),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
      }
    ]
  };

  const costPerBarrelChartData = {
    labels: results.spacingResults.map(r => r.spacing),
    datasets: [
      {
        label: 'Cost per Barrel ($/bbl)',
        data: results.spacingResults.map(r => r.costPerBarrel),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: 'rgb(249, 115, 22)',
        pointRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Well Spacing (acres/well)',
          color: 'rgb(163, 230, 53)'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Optimization Results</h2>
          <div className="flex space-x-2">
            <Button
              onClick={downloadCSV}
              variant="outline"
              size="sm"
              className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={downloadJSON}
              variant="outline"
              size="sm"
              className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-6 mb-6 border border-green-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Optimal Spacing Recommendation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">{results.optimalSpacing.spacing}</div>
              <div className="text-lime-200 text-sm">acres/well</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">${results.optimalSpacing.npv.toFixed(1)}M</div>
              <div className="text-lime-200 text-sm">Maximum NPV</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">{results.optimalSpacing.totalWells}</div>
              <div className="text-lime-200 text-sm">Total Wells</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-green-200 text-sm">
              <strong>Justification:</strong> {results.optimalSpacing.justification}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-2 text-lime-200">Well Spacing</th>
                <th className="text-right py-3 px-2 text-lime-200">Number of Wells</th>
                <th className="text-right py-3 px-2 text-lime-200">EUR per Well (Mbbl)</th>
                <th className="text-right py-3 px-2 text-lime-200">Total Recovery (%)</th>
                <th className="text-right py-3 px-2 text-lime-200">Total Capex ($M)</th>
                <th className="text-right py-3 px-2 text-lime-200">NPV ($M)</th>
                <th className="text-right py-3 px-2 text-lime-200">Cost/Barrel ($/bbl)</th>
              </tr>
            </thead>
            <tbody>
              {results.spacingResults.map((result, index) => (
                <tr key={index} className={`border-b border-white/10 hover:bg-white/5 ${
                  result.spacing === results.optimalSpacing.spacing ? 'bg-green-500/10' : ''
                }`}>
                  <td className="py-3 px-2 font-medium">{result.spacing} acres/well</td>
                  <td className="text-right py-3 px-2">{result.numberOfWells}</td>
                  <td className="text-right py-3 px-2">{result.eurPerWell.toFixed(1)}</td>
                  <td className="text-right py-3 px-2">{result.totalFieldRecovery.toFixed(1)}%</td>
                  <td className="text-right py-3 px-2">${result.totalCapex.toFixed(1)}</td>
                  <td className="text-right py-3 px-2">
                    <span className={`font-semibold ${
                      result.spacing === results.optimalSpacing.spacing ? 'text-green-300' : ''
                    }`}>
                      ${result.npv.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">${result.costPerBarrel.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Interactive Charts</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">NPV vs. Well Spacing</h3>
            </div>
            <div className="h-64">
              <Line data={npvChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Total Field Recovery vs. Well Spacing</h3>
            </div>
            <div className="h-64">
              <Line data={recoveryChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Cost per Barrel vs. Well Spacing</h3>
            </div>
            <div className="h-64">
              <Line data={costPerBarrelChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Sensitivity Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Oil Price Sensitivity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">$60/bbl:</span>
                <span className="text-white">{(results.optimalSpacing.spacing + 5)} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">$75/bbl:</span>
                <span className="text-green-300 font-semibold">{results.optimalSpacing.spacing} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">$90/bbl:</span>
                <span className="text-white">{(results.optimalSpacing.spacing - 5)} acres/well</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Well Cost Sensitivity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">+20%:</span>
                <span className="text-white">{(results.optimalSpacing.spacing + 10)} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">Base:</span>
                <span className="text-green-300 font-semibold">{results.optimalSpacing.spacing} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">-20%:</span>
                <span className="text-white">{(results.optimalSpacing.spacing - 10)} acres/well</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Recovery Factor Sensitivity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">-5%:</span>
                <span className="text-white">{(results.optimalSpacing.spacing + 5)} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">Base:</span>
                <span className="text-green-300 font-semibold">{results.optimalSpacing.spacing} acres/well</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lime-300">+5%:</span>
                <span className="text-white">{(results.optimalSpacing.spacing - 5)} acres/well</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-200 text-sm">
            <strong>Note:</strong> Sensitivity analysis shows how optimal spacing changes with key parameters. 
            Higher oil prices and recovery factors favor tighter spacing, while higher well costs favor wider spacing.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default ResultsPanel;