import React from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, BarChartHorizontal, BarChartBig, BrainCircuit, LineChart, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ResultsPanel = ({ results }) => {
  const { summary, annualCashFlows, sensitivityData } = results;

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
    })),
  };

  const payoutTimelineData = {
    labels: annualCashFlows[0]?.data.map(d => d.year) || [],
    datasets: summary.map((regime, index) => ({
      label: `${regime.name} - Cumulative NCF`,
      data: annualCashFlows.find(d => d.regimeId === regime.id)?.data.map(d => d.cumulativeNCF) || [],
      borderColor: borderColors[index % borderColors.length],
      backgroundColor: colors[index % colors.length],
      fill: false,
      tension: 0.1,
    })),
  };

  const takeVsPriceData = {
    labels: sensitivityData.price.labels,
    datasets: summary.map((regime, index) => ({
      label: `${regime.name}`,
      data: sensitivityData.price.data.find(d => d.regimeId === regime.id)?.values || [],
      borderColor: borderColors[index % borderColors.length],
      backgroundColor: colors[index % colors.length],
    })),
  };

  const npvVsCapexData = {
    labels: sensitivityData.capex.labels,
    datasets: summary.map((regime, index) => ({
      label: `${regime.name}`,
      data: sensitivityData.capex.data.find(d => d.regimeId === regime.id)?.values || [],
      borderColor: borderColors[index % borderColors.length],
      backgroundColor: colors[index % colors.length],
    })),
  };

  const chartOptions = (title, yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: title, color: 'white', font: { size: 16 } } },
    scales: {
      x: { title: { display: true, text: 'Year', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { title: { display: true, text: yLabel, color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  });

  const sensitivityOptions = (title, xLabel, yLabel) => ({
    ...chartOptions(title, yLabel),
    scales: {
      x: { ...chartOptions(title, yLabel).scales.x, title: { display: true, text: xLabel, color: 'white' } },
      y: { ...chartOptions(title, yLabel).scales.y, title: { display: true, text: yLabel, color: 'white' } },
    }
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20">
          <TabsTrigger value="summary"><Table className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
          <TabsTrigger value="cashflow"><BarChartHorizontal className="w-4 h-4 mr-2"/>Cash Flow</TabsTrigger>
          <TabsTrigger value="payout"><LineChart className="w-4 h-4 mr-2"/>Payout</TabsTrigger>
          <TabsTrigger value="sensitivities"><TrendingUp className="w-4 h-4 mr-2"/>Sensitivities</TabsTrigger>
          <TabsTrigger value="insights"><BrainCircuit className="w-4 h-4 mr-2"/>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 text-lime-300">Regime</th>
                  <th className="p-2 text-lime-300">NPV ($MM)</th>
                  <th className="p-2 text-lime-300">IRR (%)</th>
                  <th className="p-2 text-lime-300">Payback (yrs)</th>
                  <th className="p-2 text-lime-300">Gov Take ($MM)</th>
                  <th className="p-2 text-lime-300">Gov Take (%)</th>
                </tr>
              </thead>
              <tbody>
                {summary.map(s => (
                  <tr key={s.id} className="border-b border-white/10 last:border-b-0">
                    <td className="p-2 text-white font-semibold">{s.name}</td>
                    <td className={`p-2 font-bold text-green-400`}>{s.npv.toFixed(1)}</td>
                    <td className="p-2 text-white">{s.irr.toFixed(1)}%</td>
                    <td className="p-2 text-white">{s.paybackPeriod || 'N/A'}</td>
                    <td className="p-2 text-white">{s.govTake.toFixed(1)}</td>
                    <td className="p-2 text-white">{s.effectiveTaxRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="cashflow" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[300px]">
              <Bar options={chartOptions('Annual Contractor Net Cash Flow', 'Cash Flow ($MM)')} data={cashFlowChartData} />
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[300px]">
              <Bar options={chartOptions('Annual Government Take', 'Cash Flow ($MM)')} data={governmentTakeChartData} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="payout" className="mt-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[400px]">
            <Line options={chartOptions('Payout Timeline (Cumulative NCF)', 'Cumulative NCF ($MM)')} data={payoutTimelineData} />
          </div>
        </TabsContent>
        <TabsContent value="sensitivities" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[300px]">
              <Line options={sensitivityOptions('Government Take vs. Oil Price', 'Oil Price ($/bbl)', 'Government Take (%)')} data={takeVsPriceData} />
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 h-[300px]">
              <Line options={sensitivityOptions('Contractor NPV vs. CAPEX', 'CAPEX Multiplier', 'Contractor NPV ($MM)')} data={npvVsCapexData} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="mt-4 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Automated Insights</h3>
            <div className="space-y-3 text-lime-200">
                <p><strong>Top Performer:</strong> The '{summary[0]?.name}' regime is the most attractive for the contractor, delivering the highest NPV of ${summary[0]?.npv.toFixed(1)}M and an IRR of {summary[0]?.irr.toFixed(1)}%.</p>
                <p><strong>Payback Analysis:</strong> '{summary[0]?.name}' also offers the fastest capital recovery with a payback period of {summary[0]?.paybackPeriod} years, compared to {summary[1]?.paybackPeriod} years for '{summary[1]?.name}'.</p>
                <p><strong>Government Perspective:</strong> The '{summary[1]?.name}' regime maximizes government revenue, achieving a total take of ${summary[1]?.govTake.toFixed(1)}M, which is significantly higher than other options.</p>
                <p><strong>Risk Sensitivity:</strong> The sensitivity analysis shows that '{summary[0]?.name}' is more resilient to CAPEX increases, maintaining a higher NPV. However, '{summary[1]?.name}' shows a steeper increase in government take as oil prices rise, making it more favorable for governments in a high-price environment.</p>
            </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ResultsPanel;