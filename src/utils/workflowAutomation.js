export const WORKFLOW_TEMPLATES = [
    { id: 'standard', name: 'Standard PPFG Analysis', steps: ['Load Logs', 'Calc OBG', 'Pick Shale', 'Calc PP', 'Calc FG'] },
    { id: 'fasttrack', name: 'Fast-Track Lookahead', steps: ['Load Real-time', 'Update Trend', 'Forecast PP'] },
    { id: 'postdrill', name: 'Post-Drill Audit', steps: ['Load Final Logs', 'Calibrate Model', 'Compare Prognosis', 'Generate Report'] }
];

export const scheduleJob = async (jobConfig) => {
    console.log('Scheduling job:', jobConfig);
    return 'job_' + Math.random().toString(36).substr(2, 9);
};