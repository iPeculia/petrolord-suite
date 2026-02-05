import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, BookOpen } from 'lucide-react';
import { mockCourses } from '@/data/training/mockTrainingData';

const CourseList = ({ searchQuery }) => {
    const filteredCourses = mockCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-slate-900 border-slate-800 flex flex-col h-full overflow-hidden hover:border-slate-700 transition-all group">
                    <div className="relative h-40 bg-slate-950 overflow-hidden">
                         <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2">
                             <Badge variant="secondary" className={`
                                ${course.level === 'Beginner' ? 'bg-green-900 text-green-300' : ''}
                                ${course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' : ''}
                                ${course.level === 'Advanced' ? 'bg-red-900 text-red-300' : ''}
                            `}>
                                {course.level}
                            </Badge>
                        </div>
                    </div>
                    <CardContent className="p-5 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} Lessons</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-800 mt-auto bg-slate-900/50">
                        <div className="flex items-center gap-1 mt-4">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-white">{course.rating}</span>
                        </div>
                        <Button className="mt-4" variant={course.enrolled ? "secondary" : "default"}>
                            {course.enrolled ? "Continue" : "Enroll Now"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            {filteredCourses.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                    No courses found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
};

export default CourseList;