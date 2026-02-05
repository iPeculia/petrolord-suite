import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Activity, TrendingUp, Thermometer, Droplets } from 'lucide-react';

const AdvancedTechniquesGuide = () => {
  const techniques = [
    {
        id: "anisotropy",
        title: "Anisotropy Handling (VTI, HTI, TTI)",
        icon: Layers,
        content: (
            <div className="space-y-2">
                <p>Seismic velocity is rarely isotropic. This module supports:</p>
                <ul className="list-disc list-inside pl-2">
                    <li><strong>VTI (Vertical Transverse Isotropy):</strong> Common in shales. Define parameters Epsilon (ε) and Delta (δ) to correct misties between seismic and well depths.</li>
                    <li><strong>HTI (Horizontal Transverse Isotropy):</strong> Used for fractured reservoirs.</li>
                    <li><strong>TTI (Tilted Transverse Isotropy):</strong> Essential for dipping beds near salt flanks or fold belts.</li>
                </ul>
                <div className="bg-slate-950 p-2 rounded text-xs font-mono mt-2 border border-slate-800">
                    Formula: V_nmo = V_vertical * sqrt(1 + 2δ)
                </div>
            </div>
        )
    },
    {
        id: "inversion",
        title: "Velocity Inversion Detection & Correction",
        icon: Activity,
        content: (
            <div className="space-y-2">
                <p>Velocity inversions (where velocity decreases with depth) physically occur in:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Overpressure zones (compaction disequilibrium).</li>
                    <li>Gas clouds or shallow gas anomalies.</li>
                    <li>Salt inclusions or carbonate stringers encasing lower velocity rock.</li>
                </ul>
                <p>Use the <strong>Smart Curve Detector</strong> to flag these automatically vs. data errors (cycle skipping).</p>
            </div>
        )
    },
    {
        id: "pressure",
        title: "Pore Pressure & Geomechanics Link",
        icon: Droplets,
        content: (
            <div className="space-y-2">
                <p>Velocity is a primary input for pore pressure prediction (Eaton or Bowers methods).</p>
                <p>Enable the <strong>Pressure Link</strong> to calculate:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Pore Pressure Gradient (PPG)</li>
                    <li>Fracture Gradient (FG)</li>
                    <li>Overburden Gradient (OBG)</li>
                </ul>
                <p className="text-xs text-slate-400 mt-1">Note: Requires density log integration for accurate OBG.</p>
            </div>
        )
    },
    {
        id: "geothermal",
        title: "Geothermal Gradient Effects",
        icon: Thermometer,
        content: (
            <div className="space-y-2">
                <p>High temperatures can affect acoustic properties, especially in heavy oil or steam injection fields.</p>
                <p>Use the <strong>Temperature Correction</strong> module to normalize sonic logs before building the regional trend.</p>
            </div>
        )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Advanced Velocity Modeling Techniques</h2>
            <Badge variant="outline" className="border-purple-500 text-purple-400">Expert Level</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Lateral Variation Modeling</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                    Moving beyond layer-cake models. Use kriging with external drift (KED) to guide velocity interpolation using seismic horizons or attribute maps.
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Depth-Dependent Functions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                    Implement complex V(z) functions like V0 + k*Z^n or instantaneous velocity fields derived from tomographic inversion.
                </CardContent>
            </Card>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
            {techniques.map((tech) => (
                <AccordionItem key={tech.id} value={tech.id} className="bg-slate-900 border border-slate-800 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-800 rounded-md text-purple-400">
                                <tech.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-200">{tech.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-sm pb-4 pl-12">
                        {tech.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
};

export default AdvancedTechniquesGuide;