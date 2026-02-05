import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, X } from 'lucide-react';
import { useStudio } from '@/contexts/StudioContext';

const AdvancedSearchPanel = ({ onSelect }) => {
    const { allAssets } = useStudio();
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        if (!query && typeFilter === 'all') {
            setResults([]);
            return;
        }

        const filtered = allAssets.filter(asset => {
            const matchType = typeFilter === 'all' || asset.type === typeFilter;
            const matchText = asset.name.toLowerCase().includes(query.toLowerCase());
            return matchType && matchText;
        });
        setResults(filtered);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-80">
            <div className="p-4 border-b border-slate-800">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center">
                    <Search className="w-4 h-4 mr-2" /> Advanced Search
                </h3>
                <div className="space-y-2">
                    <Input 
                        placeholder="Search assets..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-slate-950 border-slate-800 h-8 text-xs"
                    />
                    <div className="flex gap-2">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs w-full">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="well">Wells</SelectItem>
                                <SelectItem value="seis.volume">Seismic</SelectItem>
                                <SelectItem value="horizon">Horizons</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleSearch} className="h-8 w-20 bg-cyan-600 hover:bg-cyan-700">
                            Go
                        </Button>
                    </div>
                </div>
            </div>
            <ScrollArea className="flex-grow p-2">
                {results.length === 0 ? (
                    <div className="text-center text-slate-500 mt-8 text-xs">
                        No results found or no search active.
                    </div>
                ) : (
                    <div className="space-y-1">
                        {results.map(asset => (
                            <div 
                                key={asset.id}
                                onClick={() => onSelect && onSelect(asset)}
                                className="p-2 rounded bg-slate-800/50 hover:bg-slate-800 cursor-pointer flex items-center justify-between group"
                            >
                                <div>
                                    <div className="text-xs font-medium text-slate-200">{asset.name}</div>
                                    <div className="text-[10px] text-slate-500 capitalize">{asset.type}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default AdvancedSearchPanel;