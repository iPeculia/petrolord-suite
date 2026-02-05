import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle } from 'lucide-react';

const QCStandardsAndBestPractices = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white">QC Standards & Protocols</h2>
        
        <Tabs defaultValue="inputs" className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start h-10 p-0">
                <TabsTrigger value="inputs" className="h-full px-6 rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400">Input Data QC</TabsTrigger>
                <TabsTrigger value="model" className="h-full px-6 rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400">Model QC</TabsTrigger>
                <TabsTrigger value="residuals" className="h-full px-6 rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400">Residual Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="p-4 bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg mt-0">
                <div className="space-y-4">
                    <h3 className="font-bold text-white">Checkshot & VSP Validation Criteria</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span><strong>Datum Consistency:</strong> Ensure SRD (Seismic Reference Datum) matches Checkshot Datum. A 20m shift is common and disastrous.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span><strong>Monotonicity:</strong> Time and Depth must always increase. Check for cycle skips or typo errors in CSV imports.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span><strong>Origin Check:</strong> Does T=0 at Z=0 (or Z=SRD)? If not, static corrections may be missing.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span><strong>Reject:</strong> Any checkshot with interval velocity &lt; 1450 m/s (water velocity) unless shallow gas is known.</span>
                        </li>
                    </ul>
                </div>
            </TabsContent>

            <TabsContent value="model" className="p-4 bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg mt-0">
                 <div className="space-y-4">
                    <h3 className="font-bold text-white">Velocity Model Health Checks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-700 rounded bg-slate-950/50">
                            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase">Bull's Eyes</h4>
                            <p className="text-xs text-slate-400">Inspect V0 and k maps for tight, circular contours around wells. This indicates the well data forces a gradient inconsistent with the background trend. Investigate the well data or relax the gridding.</p>
                        </div>
                        <div className="p-3 border border-slate-700 rounded bg-slate-950/50">
                            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase">Geological Conformity</h4>
                            <p className="text-xs text-slate-400">Velocity contours should generally follow structural contours or depositional trends. If velocity cuts across structure perpendicularly without geological reason (fault/facies change), suspect an artifact.</p>
                        </div>
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="residuals" className="p-4 bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg mt-0">
                <h3 className="font-bold text-white mb-2">Residual Statistics Thresholds</h3>
                <p className="text-sm text-slate-400 mb-4">Acceptable mistie tolerances depend on the project stage.</p>
                <div className="space-y-2">
                     <div className="flex justify-between text-sm border-b border-slate-800 pb-1">
                        <span className="text-slate-300">Exploration / Regional</span>
                        <span className="text-emerald-400">+/- 30m or 1.5%</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-800 pb-1">
                        <span className="text-slate-300">Appraisal / Development</span>
                        <span className="text-blue-400">+/- 10m or 0.5%</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-800 pb-1">
                        <span className="text-slate-300">Targeting (Horizontal Landing)</span>
                        <span className="text-purple-400">+/- 3m or 0.2%</span>
                     </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default QCStandardsAndBestPractices;