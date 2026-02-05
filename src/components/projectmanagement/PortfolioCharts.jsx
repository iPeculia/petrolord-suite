import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const PortfolioCharts = ({ projects }) => {
  // Process data for Stage Distribution
  const stageData = React.useMemo(() => {
      const counts = {};
      projects.forEach(p => {
          const stage = p.stage || 'Unknown';
          counts[stage] = (counts[stage] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  // Process data for Spend vs Budget (Top 5 by Budget)
  const spendData = React.useMemo(() => {
      return [...projects]
          .sort((a, b) => (b.baseline_budget || 0) - (a.baseline_budget || 0))
          .slice(0, 5)
          .map(p => ({
              name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
              Budget: parseFloat(p.baseline_budget) || 0,
              Actual: parseFloat(p.actual_cost) || 0, // Assuming derived
              Forecast: (parseFloat(p.baseline_budget) || 0) * 1.1 // Mock
          }));
  }, [projects]);

  // Mock Trend Data for Analytics (simulating history)
  const trendData = [
      { month: 'Jan', CPI: 1.02, SPI: 0.98 },
      { month: 'Feb', CPI: 1.01, SPI: 0.99 },
      { month: 'Mar', CPI: 0.99, SPI: 0.97 },
      { month: 'Apr', CPI: 0.98, SPI: 0.95 },
      { month: 'May', CPI: 0.96, SPI: 0.92 },
      { month: 'Jun', CPI: 0.97, SPI: 0.94 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stage Distribution */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Project Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {stageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spend Analysis */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Budget vs Forecast (Top 5 Projects)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `$${val/1000000}M`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Forecast" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

       {/* Performance Trend */}
       <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Portfolio Performance Trend (6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis domain={[0.8, 1.2]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="SPI" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="CPI" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    {/* Reference Line for 1.0 */}
                    <Line type="monotone" dataKey={() => 1} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Baseline" />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioCharts;