import { useState, useEffect, useCallback } from 'react';
import { loadMultiWellData } from '@/utils/wellDataLoader';
import { aggregateStatistics } from '@/utils/multiWellAnalysis';
import { detectAnomalies } from '@/utils/anomalyDetection';
import { calculatePortfolioRisk } from '@/utils/portfolioRiskCalculator';

export const usePhase5State = () => {
    const [wells, setWells] = useState([]);
    const [selectedWellIds, setSelectedWellIds] = useState([]);
    const [stats, setStats] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [portfolioRisk, setPortfolioRisk] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Load
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                const data = await loadMultiWellData();
                if (isMounted) {
                    setWells(data);
                    // Default select all wells initially
                    const allIds = data.map(w => w.id);
                    setSelectedWellIds(allIds);
                    
                    // Run initial calculations based on all wells
                    updateCalculations(data, allIds);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Failed to load multi-well data:", err);
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    // Re-run calculations whenever selection changes
    useEffect(() => {
        if (wells.length > 0) {
            updateCalculations(wells, selectedWellIds);
        }
    }, [selectedWellIds, wells]);

    const updateCalculations = (allWells, selectedIds) => {
        const activeWells = allWells.filter(w => selectedIds.includes(w.id));
        
        if (activeWells.length > 0) {
            setStats(aggregateStatistics(activeWells));
            setAnomalies(detectAnomalies(activeWells));
            setPortfolioRisk(calculatePortfolioRisk(activeWells));
        } else {
            setStats([]);
            setAnomalies([]);
            setPortfolioRisk(null);
        }
    };

    const toggleWellSelection = useCallback((id) => {
        setSelectedWellIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    return {
        wells,
        selectedWellIds,
        toggleWellSelection,
        stats,
        anomalies,
        portfolioRisk,
        isLoading
    };
};