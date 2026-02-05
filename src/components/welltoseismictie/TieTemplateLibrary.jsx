import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Star } from 'lucide-react';

const TieTemplateLibrary = () => {
  const templates = [
    { id: 1, name: 'North Sea Default', author: 'System', usage: 124, rating: 4.8, tags: ['Zero Phase', 'Ricker 25Hz'] },
    { id: 2, name: 'Carbonate Reef', author: 'J. Smith', usage: 45, rating: 4.5, tags: ['Min Phase', 'Ormsby'] },
    { id: 3, name: 'Deepwater GoM', author: 'K. Doe', usage: 89, rating: 4.2, tags: ['Zero Phase', 'Statistical'] },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Tie Template Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
            <Card key={template.id} className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-colors group">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400">{template.author}</Badge>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            {template.rating}
                        </div>
                    </div>
                    <CardTitle className="text-white mt-2">{template.name}</CardTitle>
                    <CardDescription className="text-slate-400">Used in {template.usage} wells</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">{tag}</span>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full border-slate-700 hover:border-blue-500 hover:text-blue-400">
                        <Copy className="w-4 h-4 mr-2" /> Apply Template
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default TieTemplateLibrary;