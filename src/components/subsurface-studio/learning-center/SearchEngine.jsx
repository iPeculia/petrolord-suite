import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchEngine = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Search Configuration</h3>
        <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input className="pl-9 bg-slate-900 border-slate-800" placeholder="Test search relevance..." />
        </div>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Search Analytics</h4>
                <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex justify-between"><span>Top Term:</span> <span className="text-white">"seismic import"</span></div>
                    <div className="flex justify-between"><span>Zero Results:</span> <span className="text-white">"dark mode config"</span></div>
                    <div className="flex justify-between"><span>Avg Click Pos:</span> <span className="text-white">1.4</span></div>
                </div>
            </CardContent>
        </Card>
    </div>
);
export default SearchEngine;