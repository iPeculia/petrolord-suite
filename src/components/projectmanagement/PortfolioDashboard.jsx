import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, LayoutGrid, List as ListIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ExecutiveSummary from './ExecutiveSummary';
import PortfolioFilters from './PortfolioFilters';
import PortfolioAnalyticsDashboard from './analytics/PortfolioAnalyticsDashboard';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PortfolioDashboard = ({ projects, onSelectProject }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle filtering logic
  useEffect(() => {
    let result = projects;

    // Search
    if (searchTerm) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    // Filters
    Object.keys(activeFilters).forEach(key => {
        if (activeFilters[key] && activeFilters[key].length > 0) {
            result = result.filter(p => activeFilters[key].includes(p[key]));
        }
    });

    setFilteredProjects(result);
  }, [projects, searchTerm, activeFilters]);

  const StatusBadge = ({ status }) => {
      const colors = {
          'Green': 'bg-green-500/20 text-green-400 border-green-500/50',
          'Amber': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
          'Red': 'bg-red-500/20 text-red-400 border-red-500/50'
      };
      return (
          <span className={`px-2 py-0.5 rounded text-xs border ${colors[status] || colors.Green}`}>
              {status || 'Green'}
          </span>
      );
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-2">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
                <p className="text-slate-400 text-sm">Managing {projects.length} active projects across {new Set(projects.map(p => p.asset)).size} assets.</p>
            </div>
        </div>

        {/* Executive Summary - Always visible at top */}
        <ExecutiveSummary projects={filteredProjects} />

        {/* Main Content Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-slate-800">
                    <TabsTrigger value="dashboard">Projects</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Search projects..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-8 bg-slate-900 border-slate-700 h-9"
                        />
                    </div>
                    <PortfolioFilters projects={projects} onFilterChange={setActiveFilters} />
                    <div className="bg-slate-800 rounded p-1 flex border border-slate-700">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-7 px-2 ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-7 px-2 ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <TabsContent value="dashboard" className="flex-1 mt-0 overflow-y-auto pb-10">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProjects.map(project => (
                            <motion.div 
                                key={project.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card 
                                    className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                                    onClick={() => onSelectProject(project.id)}
                                >
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                                                {project.stage || 'Concept'}
                                            </Badge>
                                            <StatusBadge status={project.status} />
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate" title={project.name}>{project.name}</h3>
                                            <p className="text-xs text-slate-500 truncate">{project.asset} • {project.country}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Progress</span>
                                                <span className="text-white font-mono">{project.percent_complete || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${project.percent_complete || 0}%` }} 
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Budget</p>
                                                <p className="text-sm font-mono text-slate-300">${((project.baseline_budget || 0) / 1000000).toFixed(1)}M</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 uppercase">Target Date</p>
                                                <p className="text-sm text-slate-300">{project.end_date ? format(new Date(project.end_date), 'MMM yyyy') : 'TBD'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-950 p-3 text-xs font-bold text-slate-400 border-b border-slate-800">
                            <div className="col-span-4">Project Name</div>
                            <div className="col-span-2">Stage</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Budget</div>
                            <div className="col-span-2 text-right">Completion</div>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id} 
                                    className="grid grid-cols-12 p-3 text-sm text-slate-300 hover:bg-slate-800/50 cursor-pointer items-center"
                                    onClick={() => onSelectProject(project.id)}
                                >
                                    <div className="col-span-4 font-medium text-white">{project.name}</div>
                                    <div className="col-span-2">{project.stage}</div>
                                    <div className="col-span-2"><StatusBadge status={project.status} /></div>
                                    <div className="col-span-2 text-right font-mono">${((project.baseline_budget || 0) / 1000000).toFixed(1)}M</div>
                                    <div className="col-span-2 text-right">{project.percent_complete || 0}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No projects found matching your filters.
                    </div>
                )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 flex-1 overflow-hidden">
                <PortfolioAnalyticsDashboard projects={filteredProjects} />
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default PortfolioDashboard;