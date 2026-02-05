import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const GlossaryAndTerminology = () => {
  const terms = [
    { t: "Anisotropy", d: "The variation of velocity with direction. In seismic processing, usually refers to VTI (Vertical Transverse Isotropy) where horizontal velocity differs from vertical velocity." },
    { t: "Checkshot", d: "A borehole survey that measures the travel time of a seismic pulse from surface to a receiver at a known depth. Used to calibrate velocity models." },
    { t: "Datum", d: "The reference elevation (usually Mean Sea Level or KB) from which all depths and times are measured." },
    { t: "Interval Velocity (Vint)", d: "The average velocity of a seismic wave over a specific depth interval or layer." },
    { t: "RMS Velocity (Vrms)", d: "Root Mean Square velocity. Derived from stacking velocities; slightly higher than average velocity in layered media." },
    { t: "Time-Depth (T-D) Curve", d: "A function or table relating Two-Way Time (TWT) to True Vertical Depth (TVD)." },
    { t: "V0", d: "Initial velocity at the top of a layer or at datum in a linear gradient model." },
    { t: "k (Gradient)", d: "The rate of increase of instantaneous velocity with depth (units: 1/s). V(z) = V0 + kz." },
    { t: "VSP", d: "Vertical Seismic Profile. A more detailed borehole survey than a checkshot, recording the full wavefield." }
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Glossary of Terms</h2>
        <ScrollArea className="flex-1 h-[500px] pr-4">
            <div className="grid gap-4">
                {terms.sort((a,b) => a.t.localeCompare(b.t)).map((term, i) => (
                    <div key={i} className="bg-slate-900 border-b border-slate-800 p-4 rounded-lg last:border-0">
                        <h4 className="font-bold text-emerald-400 mb-1">{term.t}</h4>
                        <p className="text-sm text-slate-400">{term.d}</p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    </div>
  );
};

export default GlossaryAndTerminology;