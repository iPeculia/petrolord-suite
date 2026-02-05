import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { CheckCircle, XCircle, TrendingUp, Thermometer, Gauge, Shield } from 'lucide-react';
    import Plotly from 'plotly.js-dist-min';
    import createPlotlyComponent from 'react-plotly.js/factory';
    const Plot = createPlotlyComponent(Plotly);

    const KPICard = ({ title, value, unit, icon: Icon, recommendation }) => (
      <Card className={`bg-slate-800/50 border-slate-700 text-white ${recommendation ? 'border-lime-500' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${recommendation ? 'text-lime-400' : 'text-cyan-300'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-slate-400">{unit}</p>
        </CardContent>
      </Card>
    );

    const ProfilePlot = ({ data, title, y1_key, y1_label, y2_key, y2_label }) => {
      const plotData = [
        { x: data.distance, y: data[y1_key], name: y1_label, type: 'scatter', mode: 'lines', yaxis: 'y1', line: { color: '#22d3ee' } },
        { x: data.distance, y: data[y2_key], name: y2_label, type: 'scatter', mode: 'lines', yaxis: 'y2', line: { color: '#a3e635' } }
      ];

      const layout = {
        title: { text: title, font: { color: '#e2e8f0', size: 16 } },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8' },
        xaxis: { title: 'Distance (miles)', gridcolor: 'rgba(255, 255, 255, 0.1)' },
        yaxis: { title: y1_label, titlefont: { color: '#22d3ee' }, tickfont: { color: '#22d3ee' }, gridcolor: 'rgba(255, 255, 255, 0.1)' },
        yaxis2: { title: y2_label, titlefont: { color: '#a3e635' }, tickfont: { color: '#a3e635' }, overlaying: 'y', side: 'right' },
        margin: { l: 65, r: 80, b: 50, t: 50, pad: 4 },
        autosize: true,
        legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' }
      };

      return (
        <div className="bg-white/5 p-2 rounded-lg h-96 border border-white/10">
          <Plot data={plotData} layout={layout} useResizeHandler={true} style={{ width: '100%', height: '100%' }} config={{ responsive: true, displaylogo: false }} />
        </div>
      );
    };

    const ResultsPanel = ({ results, inputs }) => {
      const recommended = results.recommendation;
      const profile = results.profiles[recommended.diameter];

      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Analysis for: <span className="text-cyan-300">{inputs.projectName}</span></h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard title="Recommended Diameter" value={recommended.diameter} unit="in" icon={Gauge} recommendation />
            <KPICard title="Arrival Pressure" value={recommended.arrival_pressure.toFixed(0)} unit="psig" icon={TrendingUp} />
            <KPICard title="Arrival Temperature" value={recommended.arrival_temperature.toFixed(0)} unit="°F" icon={Thermometer} />
            <KPICard title="Wall Thickness" value={recommended.wall_thickness.toFixed(3)} unit="in" icon={Shield} />
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="flow-assurance">Flow Assurance</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="mt-4">
              <Card className="bg-slate-800/50 border-slate-700 text-white">
                <CardHeader><CardTitle>Sizing Summary</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-lime-300">Diameter (in)</TableHead>
                        <TableHead className="text-lime-300">Arrival P (psig)</TableHead>
                        <TableHead className="text-lime-300">Arrival T (°F)</TableHead>
                        <TableHead className="text-lime-300">Erosional Vel. OK?</TableHead>
                        <TableHead className="text-lime-300">Pressure Drop (psi/mi)</TableHead>
                        <TableHead className="text-lime-300">Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.summary.map((row) => (
                        <TableRow key={row.diameter} className={`border-slate-700 ${row.diameter === recommended.diameter ? 'bg-lime-900/30' : ''}`}>
                          <TableCell>{row.diameter}</TableCell>
                          <TableCell>{row.arrival_pressure.toFixed(0)}</TableCell>
                          <TableCell>{row.arrival_temperature.toFixed(0)}</TableCell>
                          <TableCell className="flex items-center">
                            {row.erosional_velocity_ok ? <CheckCircle className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
                            {row.max_velocity.toFixed(2)} ft/s
                          </TableCell>
                          <TableCell>{row.pressure_drop_per_mile.toFixed(2)}</TableCell>
                          <TableCell>{row.diameter === recommended.diameter ? <span className="font-bold text-lime-300">Recommended</span> : ''}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profiles" className="mt-4 space-y-4">
              <h3 className="text-xl font-semibold text-white">Profiles for {recommended.diameter}" Diameter</h3>
              <ProfilePlot data={profile} title="Pressure & Elevation Profile" y1_key="pressure" y1_label="Pressure (psig)" y2_key="elevation" y2_label="Elevation (ft)" />
              <ProfilePlot data={profile} title="Temperature & Velocity Profile" y1_key="temperature" y1_label="Temperature (°F)" y2_key="velocity" y2_label="Velocity (ft/s)" />
            </TabsContent>
            <TabsContent value="flow-assurance" className="mt-4">
                <Card className="bg-slate-800/50 border-slate-700 text-white">
                    <CardHeader><CardTitle>Flow Assurance for {recommended.diameter}" Diameter</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg ${results.flow_assurance.slugging.risk === 'Low' ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
                                <h4 className="font-bold text-lg">Slugging Risk: {results.flow_assurance.slugging.risk}</h4>
                                <p className="text-sm text-slate-300">{results.flow_assurance.slugging.details}</p>
                            </div>
                            <div className={`p-4 rounded-lg ${results.flow_assurance.wax.risk === 'Low' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                                <h4 className="font-bold text-lg">Wax Deposition Risk: {results.flow_assurance.wax.risk}</h4>
                                <p className="text-sm text-slate-300">{results.flow_assurance.wax.details}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      );
    };

    export default ResultsPanel;