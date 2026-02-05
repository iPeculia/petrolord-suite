import React from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Rocket, Flag, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';


const GuidedModeNav = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleNext = () => {
        if(state.currentStep < 7) {
            dispatch({ type: 'NEXT_STEP' });
        }
    };

    const handlePrevious = () => {
         if(state.currentStep > 0) {
            dispatch({ type: 'PREVIOUS_STEP' });
        }
    };
    
    const handleFinish = () => {
        toast({
            title: "🎉 Workflow Complete!",
            description: "You have successfully completed the 1D MEM workflow. You can now start a new project or view your dashboard.",
            className: "bg-green-500 text-white"
        });
        dispatch({ type: 'RESET_WORKFLOW' });
        navigate('/dashboard/apps/geoscience/mechanical-earth-model');
    };

    const handleExit = () => {
      dispatch({ type: 'RESET_WORKFLOW' });
      navigate('/dashboard/geoscience');
    }
    
    // Hide navigation on steps that have their own nav buttons.
    if ([0, 1, 2].includes(state.currentStep)) {
        return null;
    }

    const isNextDisabled = !state.validation[state.currentStep];
    const isAtFinalStep = state.currentStep === 7;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <X className="h-4 w-4 mr-2" />
                                Exit Workflow
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Your progress is saved, but you will leave the guided workflow. You can return to this project later.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleExit}>Exit</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={handlePrevious} disabled={state.currentStep === 0}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    {!isAtFinalStep ? (
                        <Button onClick={handleNext} disabled={isNextDisabled}>
                            Next Step
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                         <Button className="bg-green-600 hover:bg-green-700" onClick={handleFinish} disabled={isNextDisabled}>
                            <Flag className="h-4 w-4 mr-2" />
                            Finish & Exit
                        </Button>
                    )}
                </div>

                <div className='flex gap-2'>
                    <Button variant="secondary" onClick={() => { dispatch({type: 'RESET_WORKFLOW' }); navigate(0); }}>
                        <Rocket className="h-4 w-4 mr-2" />
                        Start New Project
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GuidedModeNav;