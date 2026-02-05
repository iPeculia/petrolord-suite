import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Clock, Award, BookOpen, PlayCircle } from 'lucide-react';
import { mockCourses } from '@/data/training/mockTrainingData';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </CardContent>
    </Card>
);

const TrainingOverview = ({ onNavigate }) => {
    const enrolledCourses = mockCourses.filter(c => c.enrolled);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Enrolled" 
                    value={enrolledCourses.length} 
                    subtitle="Active courses" 
                    icon={BookOpen} 
                    color="blue" 
                />
                <StatCard 
                    title="Time Spent" 
                    value="12h" 
                    subtitle="This month" 
                    icon={Clock} 
                    color="green" 
                />
                <StatCard 
                    title="Completed" 
                    value="0" 
                    subtitle="Courses finished" 
                    icon={GraduationCap} 
                    color="purple" 
                />
                <StatCard 
                    title="Certificates" 
                    value="0" 
                    subtitle="Earned badges" 
                    icon={Award} 
                    color="yellow" 
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Continue Learning</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                        <Card key={course.id} className="bg-slate-900 border-slate-800">
                            <div className="flex flex-col sm:flex-row">
                                <div className="w-full sm:w-48 h-32 sm:h-auto bg-slate-950 relative">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-70" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="w-10 h-10 text-white/80" />
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-xs font-medium text-blue-400 mb-1">{course.lessons} Lessons</div>
                                            <h4 className="text-base font-bold text-white">{course.title}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded">{course.progress}%</span>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(course.progress / 100 * course.lessons)} / {course.lessons}</span>
                                        </div>
                                        <Progress value={course.progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    )) : (
                        <Card className="bg-slate-900 border-slate-800 col-span-full p-8 text-center">
                            <p className="text-slate-400 mb-4">You haven't enrolled in any courses yet.</p>
                            <button onClick={() => onNavigate('courses')} className="text-blue-400 font-medium hover:underline">Browse Catalog</button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingOverview;