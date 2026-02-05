import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Server, Globe, Lock, Database } from 'lucide-react';

const ProductionReadinessChecklist = () => {
    const [items, setItems] = useState([
        { id: 1, category: 'Security', label: 'Enable Row Level Security (RLS) on all tables', checked: true },
        { id: 2, category: 'Security', label: 'Configure CORS policies', checked: true },
        { id: 3, category: 'Security', label: 'Set up SSL/TLS encryption', checked: true },
        { id: 4, category: 'Performance', label: 'Optimize database indexes', checked: false },
        { id: 5, category: 'Performance', label: 'Configure CDN caching headers', checked: true },
        { id: 6, category: 'Performance', label: 'Minify and bundle assets', checked: true },
        { id: 7, category: 'Reliability', label: 'Set up automated backups', checked: false },
        { id: 8, category: 'Reliability', label: 'Configure health check endpoints', checked: true },
        { id: 9, category: 'Compliance', label: 'GDPR/CCPA data privacy review', checked: false },
        { id: 10, category: 'Compliance', label: 'Update Terms of Service & Privacy Policy', checked: true },
    ]);

    const toggleItem = (id) => {
        setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

    return (
        <div className="h-full p-4 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <ShieldCheck className="w-6 h-6 mr-2 text-green-400" /> Production Readiness
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Go-live verification checklist for EarthModel Studio.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-white">{progress}%</div>
                    <div className="text-xs text-slate-500">Ready for Launch</div>
                </div>
            </div>

            <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-green-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Security', 'Performance', 'Reliability', 'Compliance'].map(category => (
                    <Card key={category} className="bg-slate-950 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                                {category === 'Security' && <Lock className="w-4 h-4 mr-2 text-red-400" />}
                                {category === 'Performance' && <Server className="w-4 h-4 mr-2 text-blue-400" />}
                                {category === 'Reliability' && <Database className="w-4 h-4 mr-2 text-yellow-400" />}
                                {category === 'Compliance' && <Globe className="w-4 h-4 mr-2 text-purple-400" />}
                                {category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.filter(i => i.category === category).map(item => (
                                <div key={item.id} className="flex items-start space-x-3 p-2 rounded hover:bg-slate-900/50 transition-colors">
                                    <Checkbox 
                                        id={`item-${item.id}`} 
                                        checked={item.checked}
                                        onCheckedChange={() => toggleItem(item.id)}
                                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    />
                                    <label 
                                        htmlFor={`item-${item.id}`} 
                                        className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${item.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                                    >
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductionReadinessChecklist;