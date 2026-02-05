import React from 'react';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Folder, Layers, BarChart2, Users, FileText, Database, History, Settings as SettingsIcon,
    TrendingUp, Activity, Calendar, ArrowRight, MoreHorizontal, Play
} from 'lucide-react';

// Feature Card Component
const FeatureCard = ({ title, description, icon: Icon, colorClass, onClick }) => (
    <Card 
        className="bg-slate-900 border-slate-800 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
        onClick={onClick}
    >
        <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className={`p-2 rounded-lg bg-slate-950 ${colorClass} group-hover:bg-slate-800 transition-colors`}>
                <Icon className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
        </CardHeader>
        <CardContent>
            <CardTitle className="text-white mb-2 text-lg">{title}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
                {description}
            </CardDescription>
        </CardContent>
    </Card>
);

// KPI Card Component
const KpiCard = ({ label, value, trend, trendUp, icon: Icon }) => (
    <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-full border border-slate-800">
                <Icon className="w-5 h-5 text-slate-400" />
            </div>
        </CardContent>
    </Card>
);

const ProDashboardHome = () => {
    const { state, setCurrentView, loadProjects } = useReservoirCalc();
    
    const projectsCount = state.projects?.length || 0;
    const auditCount = state.auditTrail?.length || 0;
    const recentProjects = state.projects?.slice(0, 5) || [];

    const features = [
        { 
            id: 'projects', 
            title: 'Project Management', 
            desc: 'Organize, version, and manage your calculation projects efficiently.', 
            icon: Folder, 
            color: 'text-blue-400' 
        },
        { 
            id: 'batch', 
            title: 'Batch Processing', 
            desc: 'Process hundreds of datasets via CSV import with automated QC.', 
            icon: Layers, 
            color: 'text-amber-400' 
        },
        { 
            id: 'comparison', 
            title: 'Scenario Comparison', 
            desc: 'Compare multiple scenarios side-by-side with sensitivity plots.', 
            icon: BarChart2, 
            color: 'text-purple-400' 
        },
        { 
            id: 'collaboration', 
            title: 'Team Collaboration', 
            desc: 'Share projects, track changes, and collaborate in real-time.', 
            icon: Users, 
            color: 'text-emerald-400' 
        },
        { 
            id: 'reporting', 
            title: 'Report Generation', 
            desc: 'Create comprehensive PDF reports with executive summaries.', 
            icon: FileText, 
            color: 'text-rose-400' 
        },
        { 
            id: 'data-manager', 
            title: 'Data Manager', 
            desc: 'Manage database connections, fluid libraries, and parameters.', 
            icon: Database, 
            color: 'text-cyan-400' 
        },
        { 
            id: 'audit-trail', 
            title: 'Audit Trail', 
            desc: 'View detailed logs of all user actions and calculations.', 
            icon: History, 
            color: 'text-orange-400' 
        },
        { 
            id: 'settings', 
            title: 'Settings', 
            desc: 'Configure units, currencies, default parameters, and themes.', 
            icon: SettingsIcon, 
            color: 'text-slate-400' 
        }
    ];

    return (
        <div className="h-full bg-slate-950 overflow-y-auto p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Professional Dashboard</h1>
                <p className="text-slate-400">Welcome back. Here's an overview of your reservoir engineering workspace.</p>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard 
                    label="Total Projects" 
                    value={projectsCount} 
                    trend="+2 this week" 
                    trendUp={true}
                    icon={Folder} 
                />
                <KpiCard 
                    label="Calculations" 
                    value={auditCount} 
                    trend="+15% vs last mo" 
                    trendUp={true}
                    icon={Activity} 
                />
                <KpiCard 
                    label="Team Members" 
                    value="4" 
                    trend="Active" 
                    trendUp={true}
                    icon={Users} 
                />
                <KpiCard 
                    label="Avg. Accuracy" 
                    value="98.5%" 
                    trend="Stable" 
                    trendUp={true}
                    icon={TrendingUp} 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* Recent Projects Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent Projects</h2>
                        <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => setCurrentView('projects')}>
                            View All
                        </Button>
                    </div>
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-950 text-slate-400 uppercase font-medium text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Project Name</th>
                                        <th className="px-6 py-4">Reservoir</th>
                                        <th className="px-6 py-4">Last Modified</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {recentProjects.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                No projects found. Start a new calculation to see it here.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentProjects.map((project) => (
                                            <tr key={project.id} className="hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                                                            <Folder className="w-4 h-4" />
                                                        </div>
                                                        {project.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-300">
                                                    {project.inputs?.reservoirName || 'Untitled Reservoir'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                        Active
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Quick Action / Promo */}
                <div className="xl:col-span-1">
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-500/30 mb-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2">New Calculation</h3>
                            <p className="text-sm text-blue-200 mb-4">Start a new deterministic or probabilistic analysis from scratch.</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-500">
                                <Play className="w-4 h-4 mr-2" /> Start Now
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/30">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Import Data</h3>
                            <p className="text-sm text-purple-200 mb-4">Upload LAS, CSV or Excel files to populate your project.</p>
                            <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
                                Upload Files
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Feature Grid */}
            <h2 className="text-xl font-bold text-white mb-6">Tools & Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        title={feature.title}
                        description={feature.desc}
                        icon={feature.icon}
                        colorClass={feature.color}
                        onClick={() => setCurrentView(feature.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProDashboardHome;