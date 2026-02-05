import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Search, Printer, PlayCircle, ChevronRight, HelpCircle, AlertTriangle } from 'lucide-react';
import { 
    helpCategories, gettingStartedSteps, featureGuides, 
    faqs, glossary, troubleshooting, apiDocs 
} from '@/data/petrophysicsHelpContent';
import { useToast } from '@/components/ui/use-toast';

const HelpPanel = () => {
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    // Debugging mount
    useEffect(() => {
        console.log("HelpPanel mounted successfully.");
    }, []);

    // -- Search Logic --
    const searchResults = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return null;
        const lowerQ = searchQuery.toLowerCase();
        
        const results = [];
        
        // Search Glossary
        glossary.forEach(g => {
            if (g.term.toLowerCase().includes(lowerQ) || g.def.toLowerCase().includes(lowerQ)) {
                results.push({ type: 'Glossary', title: g.term, preview: g.def, section: 'glossary' });
            }
        });

        // Search FAQ
        faqs.forEach(f => {
            if (f.q.toLowerCase().includes(lowerQ) || f.a.toLowerCase().includes(lowerQ)) {
                results.push({ type: 'FAQ', title: f.q, preview: f.a, section: 'faq' });
            }
        });

        // Search Guides
        featureGuides.forEach(g => {
            if (g.title.toLowerCase().includes(lowerQ) || g.content.toLowerCase().includes(lowerQ)) {
                results.push({ type: 'Guide', title: g.title, preview: 'Found in feature guide content...', section: 'guides' });
            }
        });

        return results;
    }, [searchQuery]);

    const handleExportPDF = () => {
        toast({
            title: "Exporting Documentation",
            description: "Generating PDF file... (This is a simulation)",
        });
    };

    const renderContent = () => {
        if (searchQuery && searchResults) {
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <Search className="w-5 h-5 mr-2" /> Search Results ({searchResults.length})
                    </h3>
                    {searchResults.length === 0 ? (
                        <p className="text-slate-500">No matches found for "{searchQuery}".</p>
                    ) : (
                        <div className="grid gap-4">
                            {searchResults.map((res, idx) => (
                                <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer" onClick={() => { setActiveSection(res.section); setSearchQuery(''); }}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-blue-400">{res.title}</span>
                                            <Badge variant="outline">{res.type}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2">{res.preview}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        switch (activeSection) {
            case 'getting-started':
                return (
                    <div className="space-y-8 animate-in fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Petrolord</h2>
                            <p className="text-slate-400">Your comprehensive platform for petrophysical interpretation and reservoir characterization.</p>
                        </div>
                        <div className="grid gap-6">
                            {gettingStartedSteps.map((item, i) => (
                                <Card key={i} className="bg-slate-900 border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-emerald-400 flex items-center">
                                            <span className="bg-emerald-900/50 text-emerald-400 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 border border-emerald-800">
                                                {i + 1}
                                            </span>
                                            {item.title}
                                        </CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {item.steps.map((step, sIdx) => (
                                                <li key={sIdx} className="flex items-start text-sm text-slate-300">
                                                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600 mt-0.5" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'guides':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-white">Feature Guides</h2>
                        <Tabs defaultValue="data-management" className="w-full">
                            <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start overflow-x-auto">
                                {featureGuides.map(guide => (
                                    <TabsTrigger key={guide.id} value={guide.id}>{guide.title}</TabsTrigger>
                                ))}
                            </TabsList>
                            {featureGuides.map(guide => (
                                <TabsContent key={guide.id} value={guide.id} className="mt-4">
                                    <Card className="bg-slate-900 border-slate-800">
                                        <CardContent className="p-6 prose prose-invert max-w-none">
                                            <div className="text-slate-300 whitespace-pre-wrap">{guide.content}</div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                );

            case 'videos':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-white">Video Library</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Card key={i} className="bg-slate-900 border-slate-800 overflow-hidden group">
                                    <div className="aspect-video bg-slate-950 relative flex items-center justify-center group-hover:bg-slate-900 transition-colors cursor-pointer">
                                        <PlayCircle className="w-16 h-16 text-slate-700 group-hover:text-blue-500 transition-all" />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">05:2{i}</div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-white mb-1">Mastering Correlation Workflow {i}</h3>
                                        <p className="text-xs text-slate-400">Learn the advanced techniques for well-to-well correlation using ghost curves.</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'faq':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border border-slate-800 rounded-lg bg-slate-900 px-2">
                                    <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                );

            case 'glossary':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-white">Petrophysical Glossary</h2>
                        <div className="grid gap-4">
                            {glossary.map((item, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                                    <h4 className="text-emerald-400 font-bold mb-1">{item.term}</h4>
                                    <p className="text-sm text-slate-300">{item.def}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'troubleshooting':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-white">Troubleshooting Guide</h2>
                        <div className="space-y-4">
                            {troubleshooting.map((item, i) => (
                                <Alert key={i} className="bg-slate-900 border-slate-800">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    <AlertTitle className="text-amber-500 mb-2">Issue: {item.issue}</AlertTitle>
                                    <AlertDescription className="text-slate-300">
                                        <span className="font-semibold text-slate-500">Fix: </span>
                                        {item.solution}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
                        <h2 className="text-2xl font-bold text-white">Developer API</h2>
                        <Card className="bg-slate-950 border-slate-800 flex-1 overflow-hidden">
                            <ScrollArea className="h-[600px] p-6">
                                <pre className="font-mono text-xs text-blue-300 whitespace-pre-wrap">
                                    {apiDocs}
                                </pre>
                            </ScrollArea>
                        </Card>
                    </div>
                );

            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <div className="h-full flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-500" /> Help Hub
                    </h2>
                </div>
                
                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search docs..."
                            className="pl-8 bg-slate-950 border-slate-700 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <nav className="space-y-1">
                        {helpCategories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveSection(cat.id); setSearchQuery(''); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeSection === cat.id && !searchQuery
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-slate-800">
                    <Card className="bg-slate-950 border-slate-800 mb-4">
                        <CardContent className="p-3">
                            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Need Support?</h4>
                            <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 text-xs h-8">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                    <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-white" onClick={handleExportPDF}>
                        <Printer className="w-4 h-4 mr-2" /> Print Documentation
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default HelpPanel;