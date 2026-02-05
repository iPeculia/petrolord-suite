import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

const formatCurrency = (value, unit = 'MM') => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0) + (unit ? ` ${unit}` : '');

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-slate-600 rounded-md text-white text-sm">
        <p className="label">{`CAPEX: ${formatCurrency(data.capex)}`}</p>
        <p className="intro">{`NPV: ${formatCurrency(data.npv)}`}</p>
      </div>
    );
  }
  return null;
};

const OptimizationResults = ({ result }) => {
  if (!result) return null;

  const { optimalProjects, totalCapex, totalNpv, frontierData } = result;

  const optimalPoint = [{ capex: totalCapex, npv: totalNpv }];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500/10 via-slate-900 to-slate-900 border-green-500/30 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-green-300">Optimal Portfolio</CardTitle>
          <div className="flex flex-wrap gap-x-8 pt-2 text-slate-200">
            <p>Total CAPEX: <span className="font-bold text-amber-300">{formatCurrency(totalCapex)}</span></p>
            <p>Total NPV: <span className="font-bold text-lime-300">{formatCurrency(totalNpv)}</span></p>
            <p>Projects: <span className="font-bold text-white">{optimalProjects.length}</span></p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-slate-200">Funded Projects</h3>
              <div className="max-h-80 overflow-y-auto pr-2">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-white/20 hover:bg-transparent">
                      <TableHead className="text-white">Project</TableHead>
                      <TableHead className="text-white text-right">CAPEX</TableHead>
                      <TableHead className="text-white text-right">NPV P50</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimalProjects.map(p => (
                      <TableRow key={p.id} className="border-b-white/10">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-right text-amber-300">{formatCurrency(p.capex)}</TableCell>
                        <TableCell className="text-right text-lime-300">{formatCurrency(p.npv_p50)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-200">Efficiency Frontier</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis 
                      dataKey="capex" 
                      type="number" 
                      name="CAPEX" 
                      label={{ value: 'Total CAPEX ($MM)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(tick) => `$${tick}`}
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis 
                      dataKey="npv" 
                      type="number" 
                      name="NPV" 
                      label={{ value: 'Total NPV ($MM)', angle: -90, position: 'insideLeft', offset: -20, fill: '#94a3b8' }}
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(tick) => `$${tick}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Efficient Frontier" data={frontierData} fill="#8884d8" shape="circle" />
                    <Scatter name="Optimal Portfolio" data={optimalPoint} fill="#ffc658" shape="star" size={150} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OptimizationResults;