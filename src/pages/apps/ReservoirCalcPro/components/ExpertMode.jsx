import React from 'react';
import ExpertInputPanel from './ExpertInputPanel';
import ExpertVisPanel from './ExpertVisPanel';
import ExpertResultsPanel from './ExpertResultsPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({error}) => (
    <div role="alert" className="p-4 bg-red-900/20 border border-red-800 rounded m-4">
        <p className="text-red-400 font-bold">Something went wrong:</p>
        <pre className="text-red-300 text-xs mt-2">{error.message}</pre>
    </div>
);

const ExpertMode = () => {
    return (
        <div className="h-full p-2 bg-slate-950">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-slate-800 overflow-hidden">
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-slate-900">
                        <ExpertInputPanel />
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle className="bg-slate-800" />
                    
                    <ResizablePanel defaultSize={50}>
                        <ExpertVisPanel />
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle className="bg-slate-800" />
                    
                    <ResizablePanel defaultSize={25} minSize={20} className="bg-slate-900">
                        <ExpertResultsPanel />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ErrorBoundary>
        </div>
    );
};

export default ExpertMode;