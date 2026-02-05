import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, MapPin, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CaseStudiesLibrary = () => {
  const studies = [
    {
        title: "Deepwater Gulf of Mexico (Sub-Salt)",
        location: "GoM, USA",
        type: "Salt Tectonics",
        desc: "Handling massive salt bodies with TTI anisotropy. Workflow includes sediment flood, salt body definition, and subsalt tomography.",
        datasets: ["Checkshots (24 wells)", "Salt Horizons", "Final V-Model"]
    },
    {
        title: "North Sea Chalk Velocity Challenge",
        location: "Central Graben, UK",
        type: "Lithology Anomaly",
        desc: "Addressing the high-velocity chalk layer paradox. Using V0 maps guided by isochrons to correct pull-up effects on underlying targets.",
        datasets: ["Sonic Logs", "Chalk Isopach", "Checkshots"]
    },
    {
        title: "Southeast Asia Carbonate Buildups",
        location: "Offshore Malaysia",
        type: "Carbonate Platforms",
        desc: "Modeling sharp lateral velocity contrasts in pinnacle reefs. Strategy involves facies-based velocity population.",
        datasets: ["Well Tops", "Seismic Facies Map", "Vint Cube"]
    },
    {
        title: "West Africa Pre-Salt Exploration",
        location: "Kwanza Basin, Angola",
        type: "Complex Overburden",
        desc: "Depth conversion through layered evaporite sequences. Comparison of layered cake vs. grid-based approaches.",
        datasets: ["VSP Data", "Formation Tops", "Depth Surfaces"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Real-World Case Studies</h2>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                <Database className="w-4 h-4 mr-2" /> Download All Datasets
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studies.map((study, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border-blue-900 hover:bg-blue-900/30 mb-2">
                                {study.type}
                            </Badge>
                            <div className="flex items-center text-xs text-slate-500">
                                <MapPin className="w-3 h-3 mr-1" /> {study.location}
                            </div>
                        </div>
                        <CardTitle className="text-lg text-white">{study.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-400 min-h-[60px]">{study.desc}</p>
                        <div className="bg-slate-950 rounded p-3 border border-slate-800">
                            <span className="text-xs font-bold text-slate-500 block mb-2">INCLUDED DATASETS:</span>
                            <div className="flex flex-wrap gap-2">
                                {study.datasets.map(ds => (
                                    <Badge key={ds} variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                                        {ds}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-800 pt-4 flex gap-2">
                        <Button size="sm" className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Workflow
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <Download className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default CaseStudiesLibrary;