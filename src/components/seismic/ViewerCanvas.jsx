import React from 'react';
import { AlertOctagon as OctagonAlert } from 'lucide-react';

// This component is being decommissioned. A new, more direct viewer is being implemented.
export default function ViewerCanvas({ asset }) {
  return (
    <div className="flex-1 bg-slate-900 text-amber-300 grid place-items-center text-center p-4">
      <OctagonAlert className="w-10 h-10 mb-2"/>
      <h3 className="font-bold">Component Decommissioned</h3>
      <p className="text-xs max-w-md">
        The tiled viewer has been replaced by a new direct-rendering engine. Please select a seismic section from the project tree.
      </p>
    </div>
  );
}