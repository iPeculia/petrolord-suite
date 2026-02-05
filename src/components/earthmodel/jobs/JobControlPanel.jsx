import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, CheckCircle, AlertCircle, Clock, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobItem = ({ job }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <RotateCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md border border-slate-800 bg-slate-900/50 mb-2">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${getStatusColor(job.status)} border`}>
            {getIcon(job.status)}
        </div>
        <div>
            <div className="text-sm font-medium text-slate-200">{job.type}</div>
            <div className="text-xs text-slate-500">{job.id.substring(0, 8)} • {job.created_at}</div>
        </div>
      </div>
      <Badge variant="outline" className={`${getStatusColor(job.status)} border-none`}>
        {job.status}
      </Badge>
    </div>
  );
};

const JobControlPanel = ({ jobs = [], onRefresh }) => {
  return (
    <Card className="h-full border-slate-800 bg-slate-900 flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-400">Job Queue</CardTitle>
        <Button variant="ghost" size="icon" onClick={onRefresh} className="h-6 w-6">
            <RotateCw className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
            {jobs.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-8">No jobs in queue</div>
            ) : (
                jobs.map(job => <JobItem key={job.id} job={job} />)
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default JobControlPanel;