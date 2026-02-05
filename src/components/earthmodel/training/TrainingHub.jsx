import React from 'react';
import { useTraining } from '@/context/TrainingContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, PlayCircle, Clock, Trophy } from 'lucide-react';
import { trainingCourses } from '@/data/trainingCourses';

const TrainingHub = () => {
  const { isOpen, toggleTraining, startCourse } = useTraining();

  return (
    <Dialog open={isOpen} onOpenChange={toggleTraining}>
      <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-500" />
            Training Academy
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card className="bg-slate-900 border-slate-800 col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-white">Available Courses</CardTitle>
              <CardDescription>Enhance your skills with interactive modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainingCourses.map(course => (
                <div key={course.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-colors">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{course.title}</h4>
                    <p className="text-sm text-slate-400 mb-3">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">{course.difficulty}</span>
                    </div>
                  </div>
                  <Button onClick={() => startCourse(course.id)} size="sm" className="bg-purple-600 hover:bg-purple-500">Start</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">EarthModel Fundamentals</span>
                    <span className="text-purple-400">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Seismic Interpretation</span>
                    <span className="text-purple-400">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center" title="First Login">🥇</div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center opacity-50" title="Course Completed">🎓</div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center opacity-50" title="Expert Mode">🚀</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingHub;