import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { earthModelProMetadata } from '@/config/apps/earthmodel-pro-metadata';

const EarthModelProCard = ({ compact = false }) => {
  const navigate = useNavigate();
  const { name, description, category, status, route } = earthModelProMetadata;

  const handleLaunch = (e) => {
    // Prevent default behavior and bubbling
    e.preventDefault();
    e.stopPropagation();
    console.log(`Navigating to ${name} at ${route}`);
    navigate(route);
  };

  if (compact) {
    return (
      <div 
        onClick={handleLaunch}
        className="group flex items-center p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
      >
        <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400 mr-3 group-hover:scale-110 transition-transform">
          <Box className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 truncate">{name}</h4>
          <p className="text-xs text-slate-500 truncate">{category}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
      </div>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col" onClick={handleLaunch}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-900/20">
            <Box className="w-8 h-8" />
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            {status}
          </Badge>
        </div>
        <CardTitle className="mt-4 text-xl text-white group-hover:text-emerald-400 transition-colors">
          {name}
        </CardTitle>
        <CardDescription className="text-slate-400 line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-2">
          {earthModelProMetadata.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center text-xs text-slate-400">
              <CheckCircle2 className="w-3 h-3 mr-2 text-emerald-500/70" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 transition-all group-hover:border-emerald-500/50"
          onClick={handleLaunch}
        >
          <Play className="w-4 h-4 mr-2 fill-current" /> Launch App
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EarthModelProCard;