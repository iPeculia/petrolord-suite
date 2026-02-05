function triangular(p10, p50, p90) {
    const rand = Math.random();
    const f = (p90 - p10) > 0 ? (p50 - p10) / (p90 - p10) : 0.5;
    if (rand < f) {
        return p10 + Math.sqrt(rand * (p90 - p10) * (p50 - p10));
    } else {
        return p90 - Math.sqrt((1 - rand) * (p90 - p10) * (p90 - p50));
    }
}

const calculateEMV = (block, oilPrice = 70) => {
    const unriskedVolume = triangular(block.oil_p10, block.oil_p50, block.oil_p90);
    const capex = triangular(block.capex_p10, block.capex_p50, block.capex_p90);
    
    const revenue = unriskedVolume * oilPrice;
    const unriskedNPV = revenue - capex;
    
    const riskedNPV = unriskedNPV * (block.posg / 100);
    const emv = riskedNPV - block.bidAmount;
    return emv;
};

export const generateBidStrategy = (inputs) => {
    const { blocks, totalBidBudget } = inputs;

    const blockResults = blocks.map(block => {
        let emvSum = 0;
        const iterations = 1000;
        for (let i = 0; i < iterations; i++) {
            emvSum += calculateEMV(block);
        }
        const avgEmv = emvSum / iterations;
        return {
            ...block,
            emv: avgEmv,
            posc: block.posg,
            emvPerBidDollar: avgEmv / block.bidAmount,
        };
    });

    blockResults.sort((a, b) => b.emvPerBidDollar - a.emvPerBidDollar);

    let remainingBudget = totalBidBudget;
    const recommendations = [];
    
    for (const block of blockResults) {
        if (block.bidAmount <= remainingBudget && block.emv > 0) {
            recommendations.push({ ...block, status: 'Bid' });
            remainingBudget -= block.bidAmount;
        } else {
            recommendations.push({ ...block, status: 'Do Not Bid' });
        }
    }
    
    recommendations.sort((a,b) => a.id - b.id);

    const scatterData = {
        x: blockResults.map(b => b.emv),
        y: blockResults.map(b => b.bidAmount),
        text: blockResults.map(b => b.name),
        size: blockResults.map(b => b.emv),
        color: blockResults.map(b => b.posc),
    };
    
    const baseEMV = calculateEMV(blocks[0]);
    const posgLowEMV = calculateEMV({ ...blocks[0], posg: blocks[0].posg * 0.8 });
    const posgHighEMV = calculateEMV({ ...blocks[0], posg: blocks[0].posg * 1.2 });
    const capexLowEMV = calculateEMV({ ...blocks[0], capex_p50: blocks[0].capex_p10 });
    const capexHighEMV = calculateEMV({ ...blocks[0], capex_p50: blocks[0].capex_p90 });

    const tornadoData = {
        y: ['Geological POS', 'CAPEX'],
        x: [posgHighEMV - posgLowEMV, capexHighEMV - capexLowEMV],
        base: [posgLowEMV, capexLowEMV],
    };

    const insights = `The optimal strategy within a $${totalBidBudget}MM budget prioritizes blocks with the highest EMV per bid dollar. Block ${recommendations.find(r => r.status === 'Bid')?.name || 'N/A'} is recommended due to its strong risk-reward profile. The portfolio is most sensitive to changes in Geological POS.`;

    return {
        recommendations,
        portfolio: {
            scatter: scatterData,
            tornado: tornadoData,
        },
        insights,
    };
};