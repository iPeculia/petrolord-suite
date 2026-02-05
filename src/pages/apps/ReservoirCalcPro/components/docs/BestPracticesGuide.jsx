import React from 'react';

const BestPracticesGuide = () => (
    <div className="space-y-6">
        <h1>Best Practices</h1>
        <ul className="list-disc pl-6 space-y-3 text-slate-400">
            <li><strong>Data QC:</strong> Always visualize imported surfaces in 3D before running calculations to check for spikes or holes.</li>
            <li><strong>Units:</strong> Consistently use one unit system (Field or Metric) for an entire project to avoid conversion errors.</li>
            <li><strong>AOI:</strong> Use Polygons to exclude areas below the lowest known oil (LKO) if not using a flat contact.</li>
            <li><strong>Versioning:</strong> Save project snapshots before major changes (e.g., "Project_A_Run1", "Project_A_Run2").</li>
        </ul>
    </div>
);

export default BestPracticesGuide;