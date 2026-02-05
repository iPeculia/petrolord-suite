import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Globe, AlertTriangle, SlidersHorizontal, DraftingCompass } from 'lucide-react';

const incidentTypes = ["Kick", "Lost Circulation", "Stuck Pipe", "Equipment Failure", "Hole Instability"];

const FilterPanel = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState({
    searchTerm: 'kick',
    region: 'Nigeria',
    incidentTypes: ['Kick', 'Lost Circulation'],
    minDepth: '',
    maxDepth: '',
  });

  const handleInputChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (type) => {
    setFilters(prev => {
      const newTypes = prev.incidentTypes.includes(type)
        ? prev.incidentTypes.filter(t => t !== type)
        : [...prev.incidentTypes, type];
      return { ...prev, incidentTypes: newTypes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-grow space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            name="searchTerm" 
            value={filters.searchTerm} 
            onChange={handleInputChange} 
            placeholder="AI Search (e.g., 'kick in shallow gas')" 
            className="bg-slate-900/50 border-slate-700 pl-12 pr-4 h-12 text-lg focus:border-lime-400"
          />
        </div>

        <Accordion type="multiple" defaultValue={['location', 'type']} className="w-full">
          <AccordionItem value="location" className="border-slate-700">
            <AccordionTrigger className="text-white hover:no-underline"><Globe className="w-4 h-4 mr-2 text-lime-300"/>Location Filters</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label className="text-slate-300">Region/Country</Label>
                <Input name="region" value={filters.region} onChange={handleInputChange} className="bg-slate-900/50 border-slate-700 focus:border-lime-400" placeholder="e.g., USA, North Sea" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="type" className="border-slate-700">
            <AccordionTrigger className="text-white hover:no-underline"><AlertTriangle className="w-4 h-4 mr-2 text-lime-300"/>Incident Type</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-4">
              {incidentTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type}
                    checked={filters.incidentTypes.includes(type)}
                    onCheckedChange={() => handleCheckboxChange(type)}
                    className="border-slate-600 data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500"
                  />
                  <label htmlFor={type} className="text-sm text-slate-200 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {type}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced" className="border-slate-700">
            <AccordionTrigger className="text-white hover:no-underline"><DraftingCompass className="w-4 h-4 mr-2 text-lime-300"/>Depth Filters</AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Label className="text-slate-300">Min Depth (ft)</Label>
                <Input name="minDepth" type="number" value={filters.minDepth} onChange={handleInputChange} className="bg-slate-900/50 border-slate-700 focus:border-lime-400" />
              </div>
              <div>
                <Label className="text-slate-300">Max Depth (ft)</Label>
                <Input name="maxDepth" type="number" value={filters.maxDepth} onChange={handleInputChange} className="bg-slate-900/50 border-slate-700 focus:border-lime-400" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Search className="w-5 h-5 mr-2" />}
          Engage AI Search
        </Button>
      </div>
    </form>
  );
};

export default FilterPanel;