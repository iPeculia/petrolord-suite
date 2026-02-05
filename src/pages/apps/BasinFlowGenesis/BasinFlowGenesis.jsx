import React from 'react';
import { Helmet } from 'react-helmet';
import { BasinFlowProvider, useBasinFlow } from './contexts/BasinFlowContext';
import { MultiWellProvider } from './contexts/MultiWellContext';
import { GuidedModeProvider } from './contexts/GuidedModeContext';
import ModeSelector from './components/ModeSelector';
import GuidedModeWizard from './components/GuidedModeWizard';
import ExpertModePanel from './components/ExpertModePanel';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-lg border border-red-900/50 max-w-md text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Application Error</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Something went wrong in BasinFlow Genesis.
        </p>
        <div className="bg-slate-950 p-3 rounded mb-6 text-left overflow-auto max-h-32">
            <code className="text-xs text-red-400 font-mono">{error.message}</code>
        </div>
        <Button onClick={resetErrorBoundary} variant="outline" className="border-slate-700 hover:bg-slate-800">
          Try Again
        </Button>
      </div>
    </div>
  );
};

const BasinFlowApp = () => {
    const { state, dispatch } = useBasinFlow();

    const handleSelectMode = (mode) => {
        dispatch({ type: 'SET_MODE', payload: mode });
    };

    const handleGuidedComplete = () => {
        dispatch({ type: 'SET_MODE', payload: 'expert' });
    };

    // Listen for guided mode completion event
    React.useEffect(() => {
        const listener = () => handleGuidedComplete();
        window.addEventListener('GUIDED_MODE_COMPLETE', listener);
        return () => window.removeEventListener('GUIDED_MODE_COMPLETE', listener);
    }, []);

    return (
        <div className="h-screen w-full bg-slate-950 overflow-hidden flex flex-col">
            {!state.mode && <ModeSelector onSelectMode={handleSelectMode} />}
            
            {state.mode === 'guided' && (
                <GuidedModeProvider>
                    <GuidedModeWizard />
                </GuidedModeProvider>
            )}
            
            {state.mode === 'expert' && <ExpertModePanel />}
        </div>
    );
};

const BasinFlowGenesis = () => {
  return (
    <>
      <Helmet>
        <title>BasinFlow Genesis | PetroLord</title>
        <meta name="description" content="Advanced petroleum systems modeling and simulation platform." />
      </Helmet>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MultiWellProvider>
            <BasinFlowProvider>
                <BasinFlowApp />
            </BasinFlowProvider>
        </MultiWellProvider>
      </ErrorBoundary>
    </>
  );
};

export default BasinFlowGenesis;