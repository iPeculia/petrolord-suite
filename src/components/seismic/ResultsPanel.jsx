import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, BarChart2, Activity, Info } from 'lucide-react';
import Plot from 'react-plotly.js';
import { Textarea } from '@/components/ui/textarea';

const ResultsPanel = ({ results }) => {
  const { inputs, seismicPlot, spectrumPlot, attributePlot } = results;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{inputs.surveyName} - Seismic Analysis</h1>
        <Button variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400/10">
          <Download className="w-4 h-4 mr-2" />
          Export View
        </Button>
      </div>
      
      <div className="flex-grow flex gap-4">
        <div className="w-3/4 flex flex-col">
          <Tabs defaultValue="seismic-view" className="w-full flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="seismic-view"><Activity className="w-4 h-4 mr-2"/>Seismic View</TabsTrigger>
              {inputs.computeSpectrum && <TabsTrigger value="spectrum"><BarChart2 className="w-4 h-4 mr-2"/>Spectrum</TabsTrigger>}
              {inputs.computeAmplitude && <TabsTrigger value="attributes"><Info className="w-4 h-4 mr-2"/>Attributes</TabsTrigger>}
            </TabsList>
            <TabsContent value="seismic-view" className="flex-grow bg-white/5 rounded-b-lg p-2 mt-0">
               <Plot
                  data={seismicPlot.data}
                  layout={{ ...seismicPlot.layout, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#fff' } }}
                  useResizeHandler={true}
                  className="w-full h-full"
                />
            </TabsContent>
            {inputs.computeSpectrum && (
              <TabsContent value="spectrum" className="flex-grow bg-white/5 rounded-b-lg p-2 mt-0">
                 <Plot
                    data={spectrumPlot.data}
                    layout={{ ...spectrumPlot.layout, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#fff' } }}
                    useResizeHandler={true}
                    className="w-full h-full"
                  />
              </TabsContent>
            )}
            {inputs.computeAmplitude && (
               <TabsContent value="attributes" className="flex-grow bg-white/5 rounded-b-lg p-2 mt-0">
                 <Plot
                    data={attributePlot.data}
                    layout={{ ...attributePlot.layout, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#fff' } }}
                    useResizeHandler={true}
                    className="w-full h-full"
                  />
              </TabsContent>
            )}
          </Tabs>
        </div>
        <div className="w-1/4 flex flex-col space-y-4">
            <div className="bg-white/5 p-4 rounded-lg flex-grow">
                <h3 className="text-lg font-bold text-white mb-2">Data Statistics</h3>
                <div className="text-sm space-y-2 text-lime-200">
                    <p><strong>Min Amplitude:</strong> -0.98</p>
                    <p><strong>Max Amplitude:</strong> 1.00</p>
                    <p><strong>RMS Amplitude:</strong> 0.45</p>
                    <p><strong>Dominant Freq:</strong> 35 Hz</p>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg flex-grow">
                <h3 className="text-lg font-bold text-white mb-2">Interpretation Notes</h3>
                <Textarea placeholder="Enter your notes here..." className="h-full"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;