import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Award, BarChart2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TrainingOverview from './training/TrainingOverview';
import CourseList from './training/CourseList';

const TrainingModule = () => {
    const [activeTool, setActiveTool] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const renderTool = () => {
        switch(activeTool) {
            case 'courses': return <CourseList searchQuery={searchQuery} />;
            default: return <TrainingOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Training Academy</h2>
                    <p className="text-slate-400">Master the platform with interactive courses and certifications.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Find courses..."
                            className="pl-9 w-full sm:w-[250px] bg-slate-800 border-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 overflow-x-auto">
                        <Button 
                            variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('overview')}
                            className="text-xs whitespace-nowrap"
                        >
                            <BarChart2 className="w-4 h-4 mr-2" /> Dashboard
                        </Button>
                        <Button 
                            variant={activeTool === 'courses' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('courses')}
                            className="text-xs whitespace-nowrap"
                        >
                            <BookOpen className="w-4 h-4 mr-2" /> All Courses
                        </Button>
                        <Button 
                            variant={activeTool === 'my-learning' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('my-learning')}
                            className="text-xs whitespace-nowrap"
                        >
                            <GraduationCap className="w-4 h-4 mr-2" /> My Learning
                        </Button>
                        <Button 
                            variant={activeTool === 'certificates' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('certificates')}
                            className="text-xs whitespace-nowrap"
                        >
                            <Award className="w-4 h-4 mr-2" /> Certificates
                        </Button>
                    </div>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default TrainingModule;