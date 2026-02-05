/**
 * Industry Standard Lithology Colors
 * Based on USGS and Shell Standard Legend
 */
export const getLithologyColor = (lithology) => {
    const l = lithology?.toLowerCase() || '';

    if (l.includes('sand')) return '#FFD700'; // Yellow / Gold
    if (l.includes('shale') || l.includes('clay')) return '#A9A9A9'; // Dark Gray
    if (l.includes('lime')) return '#73C2FB'; // Maya Blue
    if (l.includes('dolomite')) return '#E0FFFF'; // Light Cyan
    if (l.includes('salt') || l.includes('halite')) return '#F0F8FF'; // Alice Blue (White-ish)
    if (l.includes('coal')) return '#1a1a1a'; // Almost Black
    if (l.includes('anhydrite')) return '#FFB6C1'; // Light Pink
    if (l.includes('gypsum')) return '#FFC0CB'; // Pink
    if (l.includes('silt')) return '#D2B48C'; // Tan
    if (l.includes('marl')) return '#98FB98'; // Pale Green
    if (l.includes('basalt') || l.includes('igneous')) return '#2F4F4F'; // Dark Slate Gray
    if (l.includes('tuff')) return '#FFA07A'; // Light Salmon

    return '#F5F5F5'; // White Smoke (Default/Unknown)
};

export const getLithologyPatternId = (lithology) => {
    const l = lithology?.toLowerCase() || '';
    if (l.includes('sand')) return 'url(#pattern-sand)';
    if (l.includes('shale')) return 'url(#pattern-shale)';
    if (l.includes('lime')) return 'url(#pattern-lime)';
    if (l.includes('salt')) return 'url(#pattern-salt)';
    if (l.includes('coal')) return 'url(#pattern-coal)';
    if (l.includes('dolomite')) return 'url(#pattern-dolomite)';
    return null;
};