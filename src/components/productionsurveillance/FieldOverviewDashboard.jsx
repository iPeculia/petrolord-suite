import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, ArrowDownCircle, AlertTriangle, CheckCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, TimeScale);

const KPI_CARDS = [
  { key: 'uptime_24h', label: 'Uptime (24h)', icon: TrendingUp },
  { key: 'lost_barrels_24h', label: 'Lost Production (24h)', icon: ArrowDownCircle },
  { key: 'downtime_duration_24h', label: 'Downtime (24h)', icon: AlertTriangle },
  { key: 'active_wells', label: 'Active Wells', icon: CheckCircle },
];

const FieldOverviewDashboard = ({ results }) => {
  if (!results) {
    return <div className="text-center text-lime-300 p-8">Run an analysis to view the field overview.</div>;
  }

  const { kpis, trendData, allocationData } = results;

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
        ticks: { color: '#e2e8f0' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        title: { display: true, text: 'Uptime (%)', color: '#e2e8f0' },
        ticks: { color: '#e2e8f0' },
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lime-300">{label}</CardTitle>
              <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpis[key]}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
            <CardHeader><CardTitle className="text-lime-300">Production & Uptime Trend (30d)</CardTitle></CardHeader>
            <CardContent className="h-96"><Bar options={chartOptions} data={chartData} /></CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader><CardTitle className="text-lime-300">Well Status</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800">
                            <TableHead className="text-lime-200">Well</TableHead>
                            <TableHead className="text-lime-200">Oil (stb/d)</TableHead>
                            <TableHead className="text-lime-200">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allocationData.wells.map(well => (
                           <TableRow key={well.wellName} className="border-slate-700 hover:bg-slate-800/50">
                                <TableCell className="text-white">{well.wellName}</TableCell>
                                <TableCell className="text-white">{well.oilRate}</TableCell>
                                <TableCell className="flex items-center text-white">
                                    <span className={`h-2 w-2 rounded-full mr-2 ${Math.random() > 0.1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {Math.random() > 0.1 ? 'Producing' : 'Shut-in'}
                                </TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldOverviewDashboard;