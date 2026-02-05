import React from 'react';
import Plot from 'react-plotly.js';
import { Button } from '@/components/ui/button';
import { Download, BarChart, Table as TableIcon, Columns, Lightbulb, CheckSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

const commonLayout = {
  autosize: true,
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#fff' },
  legend: { font: { color: '#fff' } },
};

const commonAxisLayout = (axis) => ({
  ...axis,
  color: '#fff',
  gridcolor: 'rgba(255,255,255,0.1)'
});

const ResultsPanel = ({ results, onDownload }) => {
  if (!results) return null;

  const { type, plot3d, logPlot, faciesSummary, elbowPlot, confusionMatrix } = results;

  const renderTabs = () => {
    switch (type) {
      case 'unsupervised':
        return (
          <>
            <TabsTrigger value="3d_plot"><BarChart className="w-4 h-4 mr-2" />3D Crossplot</TabsTrigger>
            <TabsTrigger value="log_plot"><Columns className="w-4 h-4 mr-2" />Facies Log</TabsTrigger>
            <TabsTrigger value="summary"><TableIcon className="w-4 h-4 mr-2" />Facies Summary</TabsTrigger>
          </>
        );
      case 'optimal-k':
        return <TabsTrigger value="elbow_plot"><Lightbulb className="w-4 h-4 mr-2" />Elbow Plot</TabsTrigger>;
      case 'supervised':
        return (
          <>
            <TabsTrigger value="log_plot"><Columns className="w-4 h-4 mr-2" />Predicted Log</TabsTrigger>
            <TabsTrigger value="validation"><CheckSquare className="w-4 h-4 mr-2" />Validation</TabsTrigger>
            <TabsTrigger value="summary"><TableIcon className="w-4 h-4 mr-2" />Facies Summary</TabsTrigger>
          </>
        );
      default:
        return null;
    }
  };
  
  const defaultTab = {
      'unsupervised': '3d_plot',
      'optimal-k': 'elbow_plot',
      'supervised': 'log_plot'
  }[type];


  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        {type !== 'optimal-k' && (
          <Button onClick={onDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Facies Log (LAS)
          </Button>
        )}
      </div>

      <Tabs defaultValue={defaultTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          {renderTabs()}
        </TabsList>

        {type === 'unsupervised' && (
          <>
            <TabsContent value="3d_plot" className="flex-grow mt-4">
              <div className="bg-gray-800/50 rounded-lg p-4 h-full">
                <Plot
                  data={plot3d.data}
                  layout={{
                    ...commonLayout, ...plot3d.layout,
                    scene: { ...plot3d.layout.scene, bgcolor: 'rgba(0,0,0,0)', 
                        xaxis: commonAxisLayout(plot3d.layout.scene.xaxis),
                        yaxis: commonAxisLayout(plot3d.layout.scene.yaxis),
                        zaxis: commonAxisLayout(plot3d.layout.scene.zaxis),
                    }
                  }}
                  useResizeHandler={true} style={{ width: '100%', height: '100%' }} config={{ responsive: true }}
                />
              </div>
            </TabsContent>
            <TabsContent value="log_plot" className="flex-grow mt-4">
              <div className="bg-gray-800/50 rounded-lg p-4 h-full">
                <Plot
                  data={logPlot.data}
                  layout={{
                    ...commonLayout, ...logPlot.layout,
                    yaxis: commonAxisLayout(logPlot.layout.yaxis),
                    xaxis: commonAxisLayout(logPlot.layout.xaxis),
                    xaxis2: commonAxisLayout(logPlot.layout.xaxis2),
                    xaxis3: commonAxisLayout(logPlot.layout.xaxis3),
                  }}
                  useResizeHandler={true} style={{ width: '100%', height: '100%' }} config={{ responsive: true }}
                />
              </div>
            </TabsContent>
          </>
        )}
        
        {type === 'supervised' && (
           <TabsContent value="log_plot" className="flex-grow mt-4">
              <div className="bg-gray-800/50 rounded-lg p-4 h-full">
                <Plot
                  data={logPlot.data}
                  layout={{
                    ...commonLayout, ...logPlot.layout,
                    yaxis: commonAxisLayout(logPlot.layout.yaxis),
                    xaxis: commonAxisLayout(logPlot.layout.xaxis),
                    xaxis2: commonAxisLayout(logPlot.layout.xaxis2),
                    xaxis3: commonAxisLayout(logPlot.layout.xaxis3),
                  }}
                  useResizeHandler={true} style={{ width: '100%', height: '100%' }} config={{ responsive: true }}
                />
              </div>
            </TabsContent>
        )}

        {(type === 'unsupervised' || type === 'supervised') && (
          <TabsContent value="summary" className="flex-grow mt-4">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <h3 className="text-xl font-bold text-white mb-4">Facies Centroid Summary</h3>
              <p className="text-sm text-gray-400 mb-4">Average log values for each identified facies.</p>
              <ScrollArea className="h-[calc(100%-80px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facies</TableHead>
                      {faciesSummary.length > 0 && Object.keys(faciesSummary[0].centroid).map(curve => (
                        <TableHead key={curve}>{curve}</TableHead>
                      ))}
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faciesSummary.map(f => (
                      <TableRow key={f.facies}>
                        <TableCell className="font-medium flex items-center">
                          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: f.color }}></span>
                          {f.facies}
                        </TableCell>
                        {Object.values(f.centroid).map((val, i) => (
                          <TableCell key={i}>{val.toFixed(2)}</TableCell>
                        ))}
                        <TableCell>{f.count}</TableCell>
                        <TableCell>{f.percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>
        )}

        {type === 'optimal-k' && elbowPlot && (
          <TabsContent value="elbow_plot" className="flex-grow mt-4">
            <div className="bg-gray-800/50 rounded-lg p-4 h-full">
              <Plot
                data={elbowPlot.data}
                layout={{ ...commonLayout, ...elbowPlot.layout, xaxis: commonAxisLayout(elbowPlot.layout.xaxis), yaxis: commonAxisLayout(elbowPlot.layout.yaxis) }}
                useResizeHandler={true} style={{ width: '100%', height: '100%' }} config={{ responsive: true }}
              />
            </div>
          </TabsContent>
        )}

        {type === 'supervised' && confusionMatrix && (
            <TabsContent value="validation" className="flex-grow mt-4">
                <div className="bg-gray-800/50 rounded-lg p-4 h-full">
                    <h3 className="text-xl font-bold text-white mb-2">Model Validation</h3>
                     <p className="text-lg text-lime-300 mb-4">Overall Accuracy: <span className="font-bold text-white">{(confusionMatrix.accuracy * 100).toFixed(2)}%</span></p>
                    <Plot
                        data={confusionMatrix.data}
                        layout={{ ...commonLayout, ...confusionMatrix.layout, xaxis: commonAxisLayout(confusionMatrix.layout.xaxis), yaxis: commonAxisLayout(confusionMatrix.layout.yaxis) }}
                        useResizeHandler={true} style={{ width: '100%', height: 'calc(100% - 60px)' }} config={{ responsive: true }}
                    />
                </div>
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ResultsPanel;