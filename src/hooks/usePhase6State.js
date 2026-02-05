import { useState } from 'react';

export const usePhase6State = () => {
    const [exportConfig, setExportConfig] = useState({
        format: 'PDF',
        sections: ['summary', 'results', 'conclusions'],
        template: 'standard'
    });

    const [integrationStatus, setIntegrationStatus] = useState({});
    const [scheduledJobs, setScheduledJobs] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const updateExportConfig = (key, value) => {
        setExportConfig(prev => ({ ...prev, [key]: value }));
    };

    const addScheduledJob = (job) => {
        setScheduledJobs(prev => [...prev, { ...job, id: Date.now(), status: 'Pending' }]);
    };

    return {
        exportConfig,
        updateExportConfig,
        integrationStatus,
        setIntegrationStatus,
        scheduledJobs,
        addScheduledJob,
        isExporting,
        setIsExporting,
        progress,
        setProgress
    };
};