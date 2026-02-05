import React from 'react';
    import { motion } from 'framer-motion';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { Package, TrendingDown } from 'lucide-react';

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-lime-400/50 rounded-md shadow-lg">
            <p className="label text-lime-300">{`Year: ${label.toFixed(2)}`}</p>
            <p className="intro text-white">{`Rate: ${payload.find(p => p.dataKey === 'rate')?.value.toFixed(0) || 0} STB/day`}</p>
            <p className="intro text-white/70">{`Reservoir Pressure: ${payload.find(p => p.dataKey === 'pressure')?.value.toFixed(0) || 0} psi`}</p>
          </div>
        );
      }
      return null;
    };

    const ForecastingPanel = ({ data }) => {
      if (!data || !data.data || data.data.length === 0) return null;

      const { data: forecastData, eur, finalRate } = data;

      const kpiCards = [
        { label: 'EUR (Est. Ultimate Recovery)', value: eur ? eur.toFixed(2) : '0.00', unit: 'MMSTB', icon: Package },
        { label: 'Final Rate', value: finalRate ? finalRate.toFixed(0) : '0', unit: 'STB/day', icon: TrendingDown },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 p-6 rounded-lg"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-lime-300">Production Decline Curve</h4>
              <p className="text-sm text-white/70 mb-4">Predicted oil rate over the forecast period based on reservoir pressure decline.</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="year" stroke="#a3e635" name="Year" unit=" yrs" />
                  <YAxis yAxisId="left" stroke="#a3e635" name="Oil Rate" unit=" STB/d" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f97316" name="Pressure" unit=" psi" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="rate" name="Oil Rate" stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="pressure" name="Reservoir Pressure" stroke="#f97316" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:w-1/4 space-y-4">
              <h4 className="text-lg font-semibold text-lime-300">Forecast Summary</h4>
              {kpiCards.map(({ label, value, unit, icon: Icon }) => (
                <div key={label} className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-lime-300" />
                    <p className="text-sm text-lime-200">{label}</p>
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{value} <span className="text-lg text-lime-300">{unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    };

    export default ForecastingPanel;