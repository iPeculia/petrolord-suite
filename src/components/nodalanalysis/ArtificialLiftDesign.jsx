import React from 'react';
    import { motion } from 'framer-motion';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { Wind, Zap } from 'lucide-react';

    const CustomTooltip = ({ active, payload, label, unitX, nameX }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-lime-400/50 rounded-md shadow-lg">
            <p className="label text-lime-300">{`${nameX}: ${label.toFixed(0)} ${unitX}`}</p>
            <p className="intro text-white">{`Oil Rate: ${payload[0].value.toFixed(0)} STB/day`}</p>
          </div>
        );
      }
      return null;
    };

    const ArtificialLiftDesign = ({ data }) => {
      if (!data) return null;

      const { gasLift, esp, conclusion } = data;

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-white mb-4">Artificial Lift Analysis</h3>
          <p className="text-lime-200 mb-6">{conclusion}</p>

          <Tabs defaultValue="gas_lift" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="gas_lift"><Wind className="w-4 h-4 mr-2" />Gas Lift Design</TabsTrigger>
              <TabsTrigger value="esp"><Zap className="w-4 h-4 mr-2" />ESP Design</TabsTrigger>
            </TabsList>
            <TabsContent value="gas_lift" className="mt-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h4 className="text-lg font-semibold text-lime-300">Gas Lift Performance Curve</h4>
                <p className="text-sm text-white/70 mb-4">{gasLift.recommendation}</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gasLift.sensitivity} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="x" stroke="#a3e635" name="Injection Rate" unit=" Mscf/d" />
                    <YAxis stroke="#a3e635" name="Oil Rate" unit=" STB/d" domain={['dataMin - 100', 'dataMax + 100']}/>
                    <Tooltip content={<CustomTooltip unitX="Mscf/d" nameX="Injection Rate"/>} />
                    <Legend />
                    <Line type="monotone" dataKey="y" name="Oil Rate" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} unit="STB/day" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="esp" className="mt-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h4 className="text-lg font-semibold text-lime-300">ESP Performance Curve</h4>
                <p className="text-sm text-white/70 mb-4">{esp.recommendation}</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={esp.sensitivity} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="x" stroke="#a3e635" name="Pressure Boost" unit=" psi" />
                    <YAxis stroke="#a3e635" name="Oil Rate" unit=" STB/d" domain={['dataMin - 100', 'dataMax + 100']}/>
                    <Tooltip content={<CustomTooltip unitX="psi" nameX="Pressure Boost"/>} />
                    <Legend />
                    <Line type="monotone" dataKey="y" name="Oil Rate" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} unit="STB/day" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      );
    };

    export default ArtificialLiftDesign;