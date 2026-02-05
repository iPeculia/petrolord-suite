import React from 'react';
import { FileCode2 } from 'lucide-react';

const SonicLogInterpretationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FileCode2 className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Sonic Log Interpretation</h2>
      </div>
      
      <div className="prose prose-invert max-w-none text-slate-300 text-sm">
        <p>
            Sonic logs (DT) measure the transit time of sound waves through the formation. They are the highest resolution velocity data available but measure only the near-borehole environment.
        </p>
        
        <h3>Types of Sonic Logs</h3>
        <ul>
            <li><strong>Compressional (DTCO/DT):</strong> Primary P-wave measurement. Used for synthetic seismograms.</li>
            <li><strong>Shear (DTSM):</strong> S-wave measurement. Critical for AVO and geomechanics.</li>
            <li><strong>Stoneley:</strong> Surface wave used for fracture detection and permeability analysis.</li>
        </ul>

        <h3>Sonic Calibration (Drift Correction)</h3>
        <p>
            Sonic logs often "drift" (accumulate error) compared to seismic times due to dispersion and frequency differences (kHz vs Hz). 
            <strong>Best Practice:</strong> Always calibrate raw sonic logs to Checkshot/VSP times before using them in a velocity model.
        </p>
      </div>
    </div>
  );
};

export default SonicLogInterpretationGuide;