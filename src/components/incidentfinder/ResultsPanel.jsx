import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, List, Map, BarChart2, BrainCircuit, ShieldCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsPanel = ({ results }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { summary, mapData, depthDistribution, incidentList, aiInsights } = results;

  const depthChartData = {
    labels: depthDistribution.map(d => `${d.depthStart}-${d.depthEnd} ft`),
    datasets: [{
      label: 'Number of Incidents',
      data: depthDistribution.map(d => d.count),
      backgroundColor: 'rgba(52, 211, 153, 0.6)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }],
  };
  const depthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: true, text: 'Incident Distribution by Depth', color: 'white', font: { size: 16 } } },
    scales: {
      x: { title: { display: true, text: 'Depth Interval (ft)', color: '#a1a1aa' }, ticks: { color: '#d4d4d8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { title: { display: true, text: 'Count', color: '#a1a1aa' }, ticks: { color: '#d4d4d8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-white">
          AI Search Complete: <span className="text-emerald-400">{summary.totalFound}</span> Incidents Found
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-lime-400"/>AI Executive Summary</h3>
            <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: aiInsights.summary }}></p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-lime-400"/>Mitigation Recommendations</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
                {aiInsights.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="list" className="data-[state=active]:bg-slate-700 data-[state=active]:text-lime-300"><List className="w-4 h-4 mr-2"/>Incident List</TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-slate-700 data-[state=active]:text-lime-300"><Map className="w-4 h-4 mr-2"/>Global Map</TabsTrigger>
          <TabsTrigger value="depth" className="data-[state=active]:bg-slate-700 data-[state=active]:text-lime-300"><BarChart2 className="w-4 h-4 mr-2"/>Depth Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="flex-grow overflow-y-auto mt-4 pr-2">
          <div className="space-y-2">
            {incidentList.map(incident => (
              <div key={incident.id} onClick={() => setSelectedIncident(incident)} className="bg-slate-800/50 p-3 rounded-lg hover:bg-slate-700/70 cursor-pointer border border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white">{incident.wellName} - <span className="font-normal text-emerald-300">{incident.type}</span></p>
                    <p className="text-sm text-slate-400">Date: {incident.date} | Depth: {incident.md} ft</p>
                  </div>
                   <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">{incident.region}</span>
                </div>
                <p className="text-sm text-slate-300 mt-2 italic">"...{incident.description}..."</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="map" className="flex-grow h-full mt-4 rounded-lg overflow-hidden">
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: '#1e293b' }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {mapData.map(incident => (
                    <Marker key={incident.id} position={[incident.lat, incident.lon]}>
                    <Popup>
                        <b>{incident.wellName}</b><br/>{incident.type} at {incident.md} ft.
                    </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </TabsContent>
        <TabsContent value="depth" className="flex-grow h-full mt-4">
            <div className="bg-slate-800/50 rounded-lg p-4 h-full border border-slate-700">
                <Bar options={depthChartOptions} data={depthChartData} />
            </div>
        </TabsContent>
      </Tabs>
      
      {selectedIncident && (
        <AlertDialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
            <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-emerald-400">{selectedIncident.wellName} - {selectedIncident.type}</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        Date: {selectedIncident.date} | Depth: {selectedIncident.md} ft MD | Region: {selectedIncident.region}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-slate-200 my-4 max-h-[40vh] overflow-y-auto pr-2">
                    <p className="font-semibold mb-2 text-lime-300">Full Report Snippet:</p>
                    <p className="bg-black/20 p-3 rounded-md border border-slate-700 italic">"{selectedIncident.description}"</p>
                
                    <div className="text-white my-4 grid grid-cols-2 gap-4">
                        <div><p className="font-semibold text-lime-300">Mud Weight:</p><p>{selectedIncident.mudWeight} ppg</p></div>
                        <div><p className="font-semibold text-lime-300">ROP:</p><p>{selectedIncident.rop} ft/hr</p></div>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700 text-white">Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </motion.div>
  );
};

export default ResultsPanel;