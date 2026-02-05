import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, BarChartHorizontal, BarChartBig, BrainCircuit } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsPanel = ({ results }) => {
  const { summary, annualCashFlows } = results;

  const colors = [
    'rgba(168, 85, 247, 0.6)', // purple
    'rgba(236, 72, 153, 0.6)', // pink
    'rgba(29, 78, 216, 0.6)',  // blue
  ];

  const borderColors = [
    'rgba(147, 51, 234, 1)',
    'rgba(219, 39, 119, 1)',
    'rgba(23, 37, 84, 1)',
  ];

  const cashFlowChartData = {
    labels: annualCashFlows[0]?.data.map(d => d.year) || [],
    datasets: summary.map((regime, index) => ({
      label: `${regime.name} - Contractor NCF`,
      data: annualCashFlows.find(d => d.regimeId === regime.id)?.data.map(d => d.contractorNCF) || [],
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
    })),
  };
  
  const governmentTakeChartData = {
    labels: annualCashFlows[0]?.data.map(d => d.year) || [],
    datasets: summary.map((regime, index) => ({
      label: `${regime.name} - Government Take`,
      data: annualCashFlows.find(d => d.regimeId === regime.id)?.data.map(d => d.governmentTake) || [],
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
      stack: `stack${index}`
    })),
  }

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: title, color: 'white', font: { size: 16 } } },
    scales: {
      x: { title: { display: true, text: 'Year', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { title: { display: true, text: 'Cash Flow ($MM)', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/20">
          <TabsTrigger value="summary"><Table className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
          <TabsTrigger value="contractor"><BarChartHorizontal className="w-4 h-4 mr-2"/>Contractor NCF</TabsTrigger>
          <TabsTrigger value="government"><BarChartBig className="w-4 h-4 mr-2"/>Government Take</TabsTrigger>
          <TabsTrigger value="insights"><BrainCircuit className="w-4 h-4 mr-2"/>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 text-lime-300">Regime</th>
                  <th className="p-2 text-lime-300">Contractor NPV ($MM)</th>
                  <th className="p-2 text-lime-300">Government Take ($MM)</th>
                  <th className="p-2 text-lime-300">Effective Tax Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {summary.map(s => (
                  <tr key={s.id} className="border-b border-white/10 last:border-b-0">
                    <td className="p-2 text-white font-semibold">{s.name}</td>
                    <td className={`p-2 font-bold text-green-400`}>{s.npv.toFixed(1)}</td>
                    <td className="p-2 text-white">{s.govTake.toFixed(1)}</td>
                    <td className="p-2 text-white">{s.effectiveTaxRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 mt-4 h-[400px]">
          <TabsContent value="contractor"><Bar options={chartOptions('Annual Contractor Net Cash Flow Comparison')} data={cashFlowChartData} /></TabsContent>
          <TabsContent value="government"><Bar options={chartOptions('Annual Government Take Comparison')} data={governmentTakeChartData} /></TabsContent>
          <TabsContent value="insights" className="p-4">
            <h3 className="text-xl font-bold text-white mb-4">Automated Insights</h3>
            <div className="space-y-3 text-lime-200">
                <p><strong>Regime Comparison:</strong> The '{summary[0]?.name}' regime yields the highest Contractor NPV of ${summary[0]?.npv.toFixed(1)}M, while '{summary[1]?.name}' results in the highest Government Take of ${summary[1]?.govTake.toFixed(1)}M.</p>
                <p><strong>Effective Tax Rate:</strong> The effective tax rate is significantly higher under the '{summary[1]?.name}' regime ({summary[1]?.effectiveTaxRate.toFixed(1)}%) compared to the '{summary[0]?.name}' regime ({summary[0]?.effectiveTaxRate.toFixed(1)}%).</p>
                <p><strong>Cash Flow Profile:</strong> The Contractor's cash flow turns positive earlier under the '{summary[0]?.name}' regime, indicating a faster payback period, largely due to the higher cost recovery limit and lower royalty rates.</p>
                <p><strong>Recommendation:</strong> For maximizing contractor returns, the '{summary[0]?.name}' is superior. However, for a government seeking to maximize its revenue, the '{summary[1]?.name}' structure is more favorable. This highlights a classic trade-off in fiscal regime design.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default ResultsPanel;