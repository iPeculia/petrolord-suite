import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, RefreshCw, MapPin, Factory } from 'lucide-react';
import { earthModelIntegrationService } from '@/services/integrations/earthModelIntegrationService';
import { useToast } from '@/components/ui/use-toast';

const FDPIntegration = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [fdpData, setFdpData] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await earthModelIntegrationService.syncDevelopmentPlan();
      setFdpData(result.plan);
      toast({ title: "Sync Complete", description: "Field Development Plan synced." });
    } catch (e) {
      toast({ title: "Sync Failed", description: "Could not connect to FDP app.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 bg-slate-950">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-white">FDP Accelerator Integration</CardTitle>
                <CardDescription>Sync Well & Facility locations from Development Plan</CardDescription>
              </div>
            </div>
            <Button onClick={handleSync} disabled={isSyncing} className="bg-purple-600 hover:bg-purple-500">
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Plan'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fdpData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" /> Planned Wells
                </h3>
                <div className="space-y-2">
                  {fdpData.wells.map((well, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-200 font-medium">{well.name}</div>
                        <div className="text-xs text-slate-500">{well.type} • ({well.location.x}, {well.location.y})</div>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{well.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-orange-400" /> Facilities
                </h3>
                <div className="space-y-2">
                  {fdpData.facilities.map((facility, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-200 font-medium">{facility.name}</div>
                        <div className="text-xs text-slate-500">{facility.type}</div>
                      </div>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">{facility.capacity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
              <p>No plan synced. Connect to FDP Accelerator to retrieve planned infrastructure.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FDPIntegration;