import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, FileText, PlayCircle, Book, ArrowRight } from 'lucide-react';
import { mockFAQs, mockArticles } from '@/data/help/mockHelpData';

const QuickLinkCard = ({ title, icon: Icon, color, onClick, description }) => (
    <Card 
        className="bg-slate-900 border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer group"
        onClick={onClick}
    >
        <CardContent className="p-6">
            <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-4">{description}</p>
            <div className={`flex items-center text-xs font-medium text-${color}-400`}>
                Explore <ArrowRight className="w-3 h-3 ml-1" />
            </div>
        </CardContent>
    </Card>
);

const HelpGuideOverview = ({ onNavigate }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickLinkCard 
                    title="FAQs" 
                    icon={MessageCircle} 
                    color="blue" 
                    description="Quick answers to common questions about FDP."
                    onClick={() => onNavigate('faqs')}
                />
                <QuickLinkCard 
                    title="User Guides" 
                    icon={FileText} 
                    color="green" 
                    description="Detailed documentation on all modules."
                    onClick={() => onNavigate('articles')}
                />
                <QuickLinkCard 
                    title="Video Tutorials" 
                    icon={PlayCircle} 
                    color="red" 
                    description="Step-by-step video walkthroughs."
                    onClick={() => onNavigate('videos')}
                />
                <QuickLinkCard 
                    title="Glossary" 
                    icon={Book} 
                    color="yellow" 
                    description="Definitions of industry terms and acronyms."
                    onClick={() => {}}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Popular Questions</h3>
                        <div className="space-y-3">
                            {mockFAQs.map(faq => (
                                <div key={faq.id} className="p-3 rounded bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-colors">
                                    <div className="text-sm font-medium text-white">{faq.question}</div>
                                    <div className="text-xs text-slate-400 mt-1 truncate">{faq.answer}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => onNavigate('faqs')} className="w-full mt-4 text-center text-sm text-blue-400 hover:text-blue-300">View all FAQs</button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Recent Articles</h3>
                        <div className="space-y-3">
                            {mockArticles.map(article => (
                                <div key={article.id} className="flex items-center justify-between p-3 rounded bg-slate-800/50 border border-slate-700 hover:border-green-500/50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <div className="text-sm font-medium text-white">{article.title}</div>
                                            <div className="text-xs text-slate-500">{article.category} • {article.readTime}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-600" />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => onNavigate('articles')} className="w-full mt-4 text-center text-sm text-green-400 hover:text-green-300">Browse Library</button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HelpGuideOverview;