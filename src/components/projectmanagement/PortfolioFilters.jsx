import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Filter, X, CheckCircle2 } from 'lucide-react';

const PortfolioFilters = ({ projects, onFilterChange }) => {
  // Extract unique values for filter options
  const countries = [...new Set(projects.map(p => p.country).filter(Boolean))];
  const assets = [...new Set(projects.map(p => p.asset).filter(Boolean))];
  const types = [...new Set(projects.map(p => p.project_type).filter(Boolean))];
  const stages = [...new Set(projects.map(p => p.stage).filter(Boolean))];
  const statuses = ['Green', 'Amber', 'Red'];

  const [filters, setFilters] = useState({
    country: [],
    asset: [],
    project_type: [],
    stage: [],
    status: []
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      country: [],
      asset: [],
      project_type: [],
      stage: [],
      status: []
    });
  };

  const activeFilterCount = Object.values(filters).flat().length;

  const FilterGroup = ({ title, category, options }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-slate-300 mb-1">{title}</h4>
      {options.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No options available</p>
      ) : (
        <div className="grid grid-cols-1 gap-1">
          {options.map(opt => (
            <div key={opt} className="flex items-center space-x-2">
              <Checkbox 
                id={`${category}-${opt}`} 
                checked={filters[category].includes(opt)}
                onCheckedChange={() => toggleFilter(category, opt)}
                className="border-slate-600 data-[state=checked]:bg-blue-600"
              />
              <Label 
                htmlFor={`${category}-${opt}`} 
                className="text-sm text-slate-400 font-normal cursor-pointer hover:text-white"
              >
                {opt}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`border-dashed ${activeFilterCount > 0 ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-slate-600 text-slate-400 hover:text-white'}`}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 bg-blue-600 text-white hover:bg-blue-700">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900 border-slate-700 p-0" align="start">
        <div className="p-4 flex justify-between items-center border-b border-slate-800">
            <h3 className="font-semibold text-white">Filter Portfolio</h3>
            {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-slate-400 hover:text-white">
                    Clear all
                    <X className="w-3 h-3 ml-1" />
                </Button>
            )}
        </div>
        <ScrollArea className="h-[400px] p-4">
            <div className="space-y-6">
                <FilterGroup title="Status" category="status" options={statuses} />
                <Separator className="bg-slate-800" />
                <FilterGroup title="Project Type" category="project_type" options={types} />
                <Separator className="bg-slate-800" />
                <FilterGroup title="Stage" category="stage" options={stages} />
                <Separator className="bg-slate-800" />
                <FilterGroup title="Asset" category="asset" options={assets} />
                <Separator className="bg-slate-800" />
                <FilterGroup title="Country" category="country" options={countries} />
            </div>
        </ScrollArea>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsOpen(false)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Apply Filters
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PortfolioFilters;