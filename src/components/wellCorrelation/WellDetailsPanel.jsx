import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MapPin, Ruler, Activity, Calendar, Database } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="w-3 h-3" />
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-xs font-medium text-slate-200">{value || '-'}</span>
  </div>
);

const WellDetailsPanel = ({ well }) => {
  if (!well) return <div className="p-4 text-xs text-slate-500">No well selected</div>;

  return (
    <div className="flex flex-col max-h-[400px]">
      <div className="p-3 border-b border-slate-800 bg-slate-900">
        <h3 className="font-bold text-sm text-white">{well.name}</h3>
        <p className="text-xs text-slate-500">{well.uwi || 'No UWI'}</p>
      </div>
      
      <ScrollArea className="flex-1 bg-slate-950">
        <div className="p-3 space-y-4">
          
          {/* Location */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Location</h4>
            <div className="space-y-0.5">
              <InfoRow icon={MapPin} label="Field" value={well.field} />
              <InfoRow icon={MapPin} label="Block" value={well.block} />
              <InfoRow icon={MapPin} label="Latitude" value={well.location?.lat?.toFixed(6)} />
              <InfoRow icon={MapPin} label="Longitude" value={well.location?.lng?.toFixed(6)} />
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Drilling Info */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Drilling Data</h4>
            <div className="space-y-0.5">
              <InfoRow icon={Ruler} label="Total Depth (MD)" value={`${well.totalDepth} m`} />
              <InfoRow icon={Ruler} label="TVD" value={`${(well.totalDepth * 0.98).toFixed(1)} m`} />
              <InfoRow icon={Calendar} label="Spud Date" value={well.spudDate} />
              <InfoRow icon={Ruler} label="KB Elevation" value={`${well.depthInfo?.reference || 0} m`} />
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Data Status */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Available Data</h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['GR', 'RES', 'NPHI', 'RHOB', 'DT', 'CALI'].map(curve => (
                <div 
                  key={curve}
                  className={`text-[9px] px-2 py-1 rounded border text-center ${
                    well.curves?.some(c => c.mnemonic.includes(curve))
                      ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {curve}
                </div>
              ))}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default WellDetailsPanel;