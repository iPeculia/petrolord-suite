import React, { useEffect } from 'react';
import { usePhase2State } from '@/hooks/usePhase2State';
import Phase2StepNavigation from './Phase2StepNavigation';
import Step1OBGCalculation from './Step1OBGCalculation';
import Step2ShalePickingTrend from './Step2ShalePickingTrend';
import Step3EffectiveStress from './Step3EffectiveStress';
import Step4PorePressure from './Step4PorePressure';
import Step5FractureGradient from './Step5FractureGradient';
import Step6CentroidAdjustment from './Step6CentroidAdjustment';
import Step7PlausibilityQC from './Step7PlausibilityQC';
import { calculatePorePressure } from '@/utils/porePressureCalculator';

const Phase2AnalysisWorkflow = ({ initialData }) => {
    const { steps, activeStep, setActiveStep, updateStep, completeStep, canAdvance } = usePhase2State(initialData);

    // Debug logging for state changes
    useEffect(() => {
        console.log(`Phase2Workflow: Active Step ${activeStep}`, steps[activeStep]);
    }, [activeStep, steps]);

    // Step Handlers
    const handleStep1Complete = (results) => {
        updateStep(1, { results });
        completeStep(1, results);
    };

    const handleStep2Complete = (results) => {
        console.log("Phase2Workflow: Step 2 Complete received:", results);
        if (results && results.nctParams) {
            updateStep(2, { results });
            completeStep(2, results);
        } else {
            console.error("Phase2Workflow: Step 2 results missing NCT parameters");
        }
    };

    const handleStep3Complete = (results) => {
        updateStep(3, { results });
        completeStep(3, results);
        
        // Auto-trigger Step 4 (PP) since it depends purely on Step 3's Sigma_e output here
        // In a real app, user might want to tweak things, but for flow we pre-calc
        if (results.sigma_e && steps[1].results?.obg_psi) {
             const ppResults = calculatePorePressure({
                 depths: initialData.depths,
                 obg_psi: steps[1].results.obg_psi,
                 sigma_e: results.sigma_e
             });
             updateStep(4, { results: ppResults });
             completeStep(4, ppResults);
        }
    };

    const handleStep4Complete = (results) => {
        updateStep(4, { results });
        completeStep(4, results);
    };
    
    const handleStep5Complete = (results) => {
        updateStep(5, { results });
        completeStep(5, results);
    };

    const handleStep6Complete = (results) => {
        updateStep(6, { results });
        completeStep(6, results);
    };

    const handleNext = () => {
        if(canAdvance(activeStep)) {
            setActiveStep(prev => Math.min(prev + 1, 7));
        } else {
            console.warn("Cannot advance: Step not completed");
        }
    };

    // Aggregated Data for QC
    const getFinalData = () => {
        if (!steps[1].results || !steps[4].results || !steps[5].results) return null;
        return {
            depths: initialData.depths,
            obg_ppg: steps[1].results.obg_ppg,
            pp_ppg: steps[6].results ? steps[6].results.pp_adj_ppg : steps[4].results.pp_ppg,
            fg_ppg: steps[5].results.fg_ppg
        };
    };

    return (
        <div className="flex h-full bg-slate-950 text-slate-200 overflow-hidden">
            <Phase2StepNavigation 
                activeStep={activeStep} 
                setActiveStep={setActiveStep} 
                stepsState={steps}
                onNext={handleNext}
                onBack={() => setActiveStep(prev => Math.max(prev - 1, 1))}
            />
            
            <div className="flex-1 p-4 overflow-hidden">
                {activeStep === 1 && (
                    <Step1OBGCalculation 
                        data={initialData} 
                        onComplete={handleStep1Complete}
                        initialParams={steps[1]}
                    />
                )}
                {activeStep === 2 && (
                    <Step2ShalePickingTrend 
                        data={initialData}
                        onComplete={handleStep2Complete}
                    />
                )}
                {activeStep === 3 && (
                    <Step3EffectiveStress 
                        obgData={steps[1].results}
                        dtData={initialData}
                        nctParams={steps[2].results?.nctParams}
                        onComplete={handleStep3Complete}
                    />
                )}
                {activeStep === 4 && (
                    <Step4PorePressure 
                        // This step is often auto-calculated in this specific chain via Step 3 complete
                        // But we show it for visualization/confirmation
                        ppData={steps[4].results}
                        depths={initialData.depths}
                        onComplete={handleStep4Complete}
                    />
                )}
                {activeStep === 5 && (
                    <Step5FractureGradient 
                        ppData={steps[4].results}
                        obgData={steps[1].results}
                        onComplete={handleStep5Complete}
                    />
                )}
                {activeStep === 6 && (
                    <Step6CentroidAdjustment 
                        ppData={steps[4].results}
                        depths={initialData.depths}
                        onComplete={handleStep6Complete}
                    />
                )}
                {activeStep === 7 && (
                    <Step7PlausibilityQC 
                        finalData={getFinalData()}
                    />
                )}
            </div>
        </div>
    );
};

export default Phase2AnalysisWorkflow;