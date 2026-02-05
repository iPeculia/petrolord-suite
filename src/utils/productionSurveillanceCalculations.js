import { addDays, format, subDays } from 'date-fns';

const DOWNTIME_REASONS = [
    'Unplanned Maintenance (Pump)',
    'Well Intervention',
    'Flowline Blockage',
    'ESP Failure',
    'SCSSV Test',
    'Planned Shutdown',
    'Bean-up',
    'Separator Trip',
    'Export System Failure',
];

const WELLS = ['Well A1', 'Well A2', 'Well B1', 'Well B3', 'Well C2', 'Well C4', 'Well D1'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

export const generateUptimeData = (inputs) => {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    const dateArray = [];
    for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
        dateArray.push(d);
    }
    
    let cumulativeProduction = 0;
    const trendData = {
        labels: dateArray.map(d => format(d, 'yyyy-MM-dd')),
        production: [],
        uptime: [],
    };
    
    const eventLog = [];
    let dailyProduction = inputs.refProdOil / 30;

    for (const date of dateArray) {
        let uptimeToday = getRandomFloat(95, 100);
        if (Math.random() < 0.2) { 
            uptimeToday = getRandomFloat(70, 94);
            const numEvents = Math.random() > 0.7 ? 2 : 1;
            for(let i=0; i<numEvents; i++){
                eventLog.push({
                    date: format(date, 'yyyy-MM-dd'),
                    asset: getRandomElement(WELLS),
                    duration: getRandomFloat(1, 8).toFixed(1),
                    category: Math.random() > 0.3 ? 'Unplanned' : 'Planned',
                    reason: getRandomElement(DOWNTIME_REASONS),
                });
            }
        }
        
        const productionToday = dailyProduction * (uptimeToday / 100);
        cumulativeProduction += productionToday;
        
        trendData.production.push(productionToday.toFixed(0));
        trendData.uptime.push(uptimeToday.toFixed(1));
    }
    
    const paretoData = DOWNTIME_REASONS.reduce((acc, reason) => {
        acc[reason] = 0;
        return acc;
    }, {});
    
    eventLog.forEach(event => {
        paretoData[event.reason] = (paretoData[event.reason] || 0) + parseFloat(event.duration);
    });
    
    const sortedPareto = Object.entries(paretoData).sort(([,a],[,b]) => b-a);

    const allocationData = WELLS.map(well => ({
        wellName: well,
        oilRate: getRandomFloat(1500, 3000).toFixed(0),
        gasRate: getRandomFloat(800, 1500).toFixed(0),
        waterRate: getRandomFloat(200, 1000).toFixed(0),
        lastTest: format(subDays(endDate, getRandomFloat(1, 20)), 'yyyy-MM-dd'),
    }));

    const totalOilAllocated = allocationData.reduce((sum, well) => sum + Number(well.oilRate), 0);
    const totalGasAllocated = allocationData.reduce((sum, well) => sum + Number(well.gasRate), 0);
    const totalWaterAllocated = allocationData.reduce((sum, well) => sum + Number(well.waterRate), 0);

    const varianceData = {
        labels: dateArray.slice(-7).map(d => format(d, 'yy-MM-dd')),
        actual: trendData.production.slice(-7),
        target: Array(7).fill(null).map(() => (inputs.refProdOil / 30).toFixed(0)),
    };
    
    return {
        kpis: {
            uptime_24h: `${trendData.uptime[trendData.uptime.length - 1]}%`,
            lost_barrels_24h: ((dailyProduction - trendData.production[trendData.production.length - 1])).toFixed(0),
            downtime_duration_24h: `${(24 * (1 - trendData.uptime[trendData.uptime.length-1]/100)).toFixed(1)} hrs`,
            downtime_events_24h: eventLog.filter(e => e.date === format(endDate, 'yyyy-MM-dd')).length,
        },
        trendData,
        eventLog: eventLog.sort((a,b) => new Date(b.date) - new Date(a.date)),
        paretoData: {
            labels: sortedPareto.map(item => item[0]),
            data: sortedPareto.map(item => item[1].toFixed(1)),
        },
        allocationData: {
            wells: allocationData,
            totals: {
                oil: totalOilAllocated.toFixed(0),
                gas: totalGasAllocated.toFixed(0),
                water: totalWaterAllocated.toFixed(0),
            }
        },
        varianceData
    };
};