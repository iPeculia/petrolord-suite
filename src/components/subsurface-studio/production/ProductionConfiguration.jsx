import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ProductionConfiguration = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-slate-400" /> Environment Config
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4 space-y-4">
                {[
                    { label: 'DATABASE_URL', value: 'postgresql://prod-db-cluster...', locked: true },
                    { label: 'REDIS_CACHE_URI', value: 'redis://cache-primary:6379', locked: true },
                    { label: 'API_RATE_LIMIT', value: '1000', locked: false },
                    { label: 'FEATURE_FLAGS', value: 'new_ui=true,beta_calc=false', locked: false }
                ].map((conf, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 text-xs font-mono text-slate-400">{conf.label}</div>
                        <div className="col-span-7 relative">
                            <Input 
                                value={conf.locked ? '••••••••••••••••••••••••' : conf.value} 
                                readOnly={conf.locked}
                                className="bg-slate-900 border-slate-800 h-8 text-xs font-mono" 
                            />
                        </div>
                        <div className="col-span-1 flex justify-end">
                            {conf.locked ? 
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Lock className="w-3 h-3"/></Button> : 
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Settings className="w-3 h-3"/></Button>
                            }
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default ProductionConfiguration;