import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockArticles } from '@/data/help/mockHelpData';
import { FileText, Clock, Eye, ChevronRight } from 'lucide-react';

const HelpArticles = ({ searchQuery }) => {
    const filteredArticles = mockArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
                <Card key={article.id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer group h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                                {article.category}
                            </span>
                            <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {article.title}
                        </h3>
                        
                        <p className="text-sm text-slate-400 mb-6 line-clamp-3 flex-1">
                            {article.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
                            </div>
                            <span className="flex items-center text-slate-400 group-hover:text-white transition-colors">
                                Read <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {filteredArticles.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                    No articles found matching your search.
                </div>
            )}
        </div>
    );
};

export default HelpArticles;