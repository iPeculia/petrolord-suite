import React, { useMemo } from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';

import WelcomeStep from './steps/WelcomeStep';
import FileUploadStep from './steps/FileUploadStep';
import CurveMappingStep from './steps/CurveMappingStep';
import DataQCStep from './steps/DataQCStep';
import InputStep from './steps/InputStep';
import CalculationStep from './steps/CalculationStep';
import ResultsStep from './steps/ResultsStep';
import ReportStep from './steps/ReportStep';

const GuidedModeWorkflow = () => {
    const { state } = useGuidedMode();
    const { currentStep } = state;

    const steps = useMemo(() => [
        { name: 'Welcome', component: WelcomeStep, isValid: state.stepValidations[0] },
        { name: 'Upload Data', component: FileUploadStep, isValid: state.stepValidations[1] },
        { name: 'Curve Mapping', component: CurveMappingStep, isValid: state.stepValidations[2] },
        { name: 'Data QC', component: DataQCStep, isValid: state.stepValidations[3] },
        { name: 'Properties', component: InputStep, isValid: state.stepValidations[4] },
        { name: 'Run Calculation', component: CalculationStep, isValid: state.stepValidations[5] },
        { name: 'View Results', component: ResultsStep, isValid: state.stepValidations[6] },
        { name: 'Report & Export', component: ReportStep, isValid: state.stepValidations[7] },
    ], [state.stepValidations]);

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto">
            <CurrentStepComponent />
        </div>
    );
};

export default GuidedModeWorkflow;