import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertTriangle, Server } from 'lucide-react';

const DeploymentMonitor = () => {
  const [status, setStatus] = useState('healthy');
  const [metrics, setMetrics] = useState({
    buildTime: '45s',
    bundleSize: '12.4MB',
    lastDeploy: new Date().toLocaleString()
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Deployment Status</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center gap-2">
          {status === 'healthy' ? (
            <span className="text-green-500 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> Online
            </span>
          ) : (
            <span className="text-amber-500 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" /> Degraded
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Environment: Production (Optimized)
        </p>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Server className="h-4 w-4" /> Bundle Size
            </span>
            <Badge variant="outline">{metrics.bundleSize}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Build Time</span>
            <span>{metrics.buildTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Deployed</span>
            <span className="text-xs">{metrics.lastDeploy}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentMonitor;