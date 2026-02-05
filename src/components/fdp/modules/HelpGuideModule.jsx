import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, PlayCircle, MessageCircle, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import HelpGuideOverview from './help/HelpGuideOverview';
import FAQSection from './help/FAQSection';
import HelpArticles from './help/HelpArticles';
import VideoTutorials from './help/VideoTutorials';

const HelpGuideModule = () => {
    const [activeTool, setActiveTool] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const renderTool = () => {
        switch(activeTool) {
            case 'faqs': return <FAQSection searchQuery={searchQuery} />;
            case 'articles': return <HelpArticles searchQuery={searchQuery} />;
            case 'videos': return <VideoTutorials searchQuery={searchQuery} />;
            default: return <HelpGuideOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Help Center</h2>
                    <p className="text-slate-400">Guides, tutorials, and support documentation.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search help..."
                            className="pl-9 w-full sm:w-[250px] bg-slate-800 border-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 overflow-x-auto">
                        <Button 
                            variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('overview')}
                            className="text-xs whitespace-nowrap"
                        >
                            <HelpCircle className="w-4 h-4 mr-2" /> Overview
                        </Button>
                        <Button 
                            variant={activeTool === 'faqs' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('faqs')}
                            className="text-xs whitespace-nowrap"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" /> FAQs
                        </Button>
                        <Button 
                            variant={activeTool === 'articles' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('articles')}
                            className="text-xs whitespace-nowrap"
                        >
                            <FileText className="w-4 h-4 mr-2" /> Articles
                        </Button>
                        <Button 
                            variant={activeTool === 'videos' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTool('videos')}
                            className="text-xs whitespace-nowrap"
                        >
                            <PlayCircle className="w-4 h-4 mr-2" /> Videos
                        </Button>
                    </div>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default HelpGuideModule;