import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const FeatureDocumentation = () => {
  const features = [
    {
        id: "wells",
        title: "Well Data Management",
        content: "Manage multi-well projects with support for checkshots, VSP, sonic logs, and formation tops. Automatically flag outliers and quality check data upon import.",
        tags: ["Core", "Data"]
    },
    {
        id: "layers",
        title: "Velocity Layer Definition",
        content: "Define geological intervals using various velocity functions: Constant, Linear Gradient (V0+kZ), Exponential Compaction, and Interval Velocity grids.",
        tags: ["Modeling", "Physics"]
    },
    {
        id: "td-conv",
        title: "Time-Depth Conversion Engine",
        content: "High-performance engine for converting seismic time grids to depth surfaces using the calibrated velocity model. Supports batch processing.",
        tags: ["Conversion", "Grid"]
    },
    {
        id: "scenarios",
        title: "Scenario Analysis (P10/P50/P90)",
        content: "Generate probabilistic velocity models to quantify depth uncertainty. Compare Low, Base, and High cases side-by-side.",
        tags: ["Uncertainty", "Risk"]
    },
    {
        id: "ai",
        title: "AI Automation",
        content: "Leverage machine learning for outlier detection, parameter suggestion based on regional trends, and automated layer picking.",
        tags: ["AI", "Advanced"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Feature Documentation</h2>
        <Accordion type="single" collapsible className="w-full space-y-2">
            {features.map((feat) => (
                <AccordionItem key={feat.id} value={feat.id} className="bg-slate-900 border border-slate-800 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full pr-4">
                            <span className="text-sm font-medium text-slate-200">{feat.title}</span>
                            <div className="flex gap-2">
                                {feat.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-sm pb-4">
                        {feat.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
};

export default FeatureDocumentation;