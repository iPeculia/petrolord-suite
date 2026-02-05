import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Activity, Map, LayoutTemplate, Clock, 
  ChevronRight, AlertCircle, CheckCircle2, PlayCircle, 
  LineChart, Workflow, Database
} from 'lucide-react';

const WellToSeismicTieHub = ({ stats, onNavigate }) => {
  const recentTies = [
    { id: 'w-123', name: '15/9-F-12', quality: 'Good', date: '2h ago', correlation: 0.85 },
    { id: 'w-124', name: '15/9-F-14', quality: 'Fair', date: '5h ago', correlation: 0.62 },
    { id: 'w-125', name: '15/9-F-1', quality: 'Poor', date: '1d ago', correlation: 0.35 },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Hero Section / Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full bg-gradient-to-br from-blue-950/40 to-slate-900 border-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden"
            onClick={() => onNavigate('quick')}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-blue-400" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/50">Guided Mode</Badge>
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-blue-400 transition-colors">Quick Tie Wizard</CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Streamlined workflow for rapid checkshot correction and synthetic generation. Perfect for first-pass ties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Auto-wavelet extraction</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Automated shift suggestions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> One-click export to Petrel</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                <PlayCircle className="w-4 h-4 mr-2" /> Start Quick Tie
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full bg-gradient-to-br from-purple-950/40 to-slate-900 border-slate-800 hover:border-purple-500/50 transition-all group cursor-pointer relative overflow-hidden"
            onClick={() => onNavigate('advanced')}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-purple-400" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/50">Expert Mode</Badge>
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-purple-400 transition-colors">Advanced Tie Lab</CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Full control over wavelet extraction, stretch/squeeze operations, and multi-window cross-correlation analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Interactive Stretch/Squeeze</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Multi-wavelet testing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> AVO Synthetic Modeling</li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                <LineChart className="w-4 h-4 mr-2" /> Enter Lab
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dashboard & Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Survey Tie Status</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-slate-400" onClick={() => onNavigate('dashboard')}>
                View Full Dashboard <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Wells</div>
                <div className="text-2xl font-bold text-white">{stats.totalWells}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Tied Wells</div>
                <div className="text-2xl font-bold text-emerald-400">{stats.tiedWells}</div>
                <Progress value={(stats.tiedWells/stats.totalWells)*100} className="h-1 mt-2 bg-emerald-950" indicatorClassName="bg-emerald-500" />
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Avg. Correlation</div>
                <div className="text-2xl font-bold text-blue-400">{stats.avgCorrelation}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Pending Review</div>
                <div className="text-2xl font-bold text-amber-400">{stats.pendingReview}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Recent Activity</h4>
              <div className="space-y-2">
                {recentTies.map((tie) => (
                  <div key={tie.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                    onClick={() => onNavigate('advanced', tie.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tie.quality === 'Good' ? 'bg-emerald-500' : 
                        tie.quality === 'Fair' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-white">{tie.name}</div>
                        <div className="text-xs text-slate-400">Edited {tie.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Correlation</div>
                        <div className="text-sm font-mono text-blue-400">{tie.correlation}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools & Templates */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white">Tools & Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800" onClick={() => onNavigate('templates')}>
                <LayoutTemplate className="w-4 h-4 mr-3 text-purple-400" /> Tie Templates
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800">
                <Map className="w-4 h-4 mr-3 text-blue-400" /> Tie Quality Map
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800">
                <Workflow className="w-4 h-4 mr-3 text-emerald-400" /> Velocity Model Integration
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800">
                <Database className="w-4 h-4 mr-3 text-amber-400" /> Export Manager
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium text-white">Data QC Alert</h4>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                3 wells have missing density logs in the target interval. Synthetic quality may be reduced.
              </p>
              <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300">
                View QC Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WellToSeismicTieHub;