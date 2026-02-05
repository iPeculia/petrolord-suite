import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, FileText, Play, Settings, HelpCircle, Code, Layout, Calculator } from 'lucide-react';
import GettingStartedGuide from './GettingStartedGuide';
import UIGuide from './UIGuide';
import InputMethodsGuide from './InputMethodsGuide';
import SurfaceImportGuide from './SurfaceImportGuide';
import FluidPropertiesGuide from './FluidPropertiesGuide';
import MapGenerationGuide from './MapGenerationGuide';
import SurfacePaintingGuide from './SurfacePaintingGuide';
import PolygonGuide from './PolygonGuide';
import IntegrationGuide from './IntegrationGuide';
import CalculationReference from './CalculationReference';
import TroubleshootingGuide from './TroubleshootingGuide';
import BestPracticesGuide from './BestPracticesGuide';
import KeyboardShortcutsGuide from './KeyboardShortcutsGuide';
import Glossary from './Glossary';
import VideoTutorials from './VideoTutorials';
import SampleProjects from './SampleProjects';
import APIDocumentation from './APIDocumentation';
import ReleaseNotes from './ReleaseNotes';
import FeedbackSupport from './FeedbackSupport';

const DocumentationHub = ({ open, onOpenChange }) => {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: Play, component: GettingStartedGuide },
        { id: 'ui-guide', label: 'Interface Guide', icon: Layout, component: UIGuide },
        { id: 'input-methods', label: 'Input Methods', icon: FileText, component: InputMethodsGuide },
        { id: 'surface-import', label: 'Surface Import', icon: FileText, component: SurfaceImportGuide },
        { id: 'fluid-properties', label: 'Fluid Properties', icon: Settings, component: FluidPropertiesGuide },
        { id: 'map-generation', label: 'Map Generation', icon: FileText, component: MapGenerationGuide },
        { id: 'surface-painting', label: 'Surface Painting', icon: FileText, component: SurfacePaintingGuide },
        { id: 'polygons', label: 'Polygons & AOI', icon: Layout, component: PolygonGuide },
        { id: 'integration', label: 'Integration', icon: Settings, component: IntegrationGuide },
        { id: 'calculations', label: 'Calculations', icon: Calculator, component: CalculationReference },
        { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle, component: TroubleshootingGuide },
        { id: 'best-practices', label: 'Best Practices', icon: Book, component: BestPracticesGuide },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Code, component: KeyboardShortcutsGuide },
        { id: 'glossary', label: 'Glossary', icon: Book, component: Glossary },
        { id: 'videos', label: 'Video Tutorials', icon: Play, component: VideoTutorials },
        { id: 'samples', label: 'Sample Projects', icon: FileText, component: SampleProjects },
        { id: 'api', label: 'API Reference', icon: Code, component: APIDocumentation },
        { id: 'release-notes', label: 'Release Notes', icon: FileText, component: ReleaseNotes },
        { id: 'feedback', label: 'Feedback & Support', icon: HelpCircle, component: FeedbackSupport },
    ];

    const filteredSections = sections.filter(s => 
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ActiveComponent = sections.find(s => s.id === activeSection)?.component || GettingStartedGuide;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[85vh] bg-slate-950 border-slate-800 p-0 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50">
                    <div className="p-4 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white mb-2">Documentation</h2>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search docs..." 
                                className="pl-8 h-9 bg-slate-900 border-slate-700 text-xs"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredSections.map(section => (
                                <Button
                                    key={section.id}
                                    variant={activeSection === section.id ? "secondary" : "ghost"}
                                    className={`w-full justify-start text-sm ${activeSection === section.id ? 'bg-blue-900/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <section.icon className="w-4 h-4 mr-2" />
                                    {section.label}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                        <div className="flex items-center text-sm text-slate-400">
                            <span className="hover:text-white cursor-pointer" onClick={() => setActiveSection('getting-started')}>Docs</span>
                            <span className="mx-2">/</span>
                            <span className="text-white font-medium">{sections.find(s => s.id === activeSection)?.label}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden md:flex">
                            Print Guide
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                        <div className="prose prose-invert max-w-none">
                            <ActiveComponent />
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentationHub;