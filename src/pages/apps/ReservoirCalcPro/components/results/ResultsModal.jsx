import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import DeterministicResultsDisplay from './DeterministicResultsDisplay';
import ProbabilisticResultsDisplay from './ProbabilisticResultsDisplay';

const ResultsModal = ({ isOpen, onClose }) => {
    const { state } = useReservoirCalc();
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-slate-950 border-slate-800 p-0 flex flex-col">
                <DialogHeader className="px-6 py-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold text-white">Calculation Results</DialogTitle>
                        <p className="text-sm text-slate-400 mt-1">
                            Project: <span className="text-emerald-400 font-medium">{state.reservoirName || 'Untitled'}</span>
                        </p>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden bg-slate-950">
                    {state.calcMethod === 'deterministic' ? (
                        <DeterministicResultsDisplay />
                    ) : (
                        <ProbabilisticResultsDisplay />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResultsModal;