export const getFormationColor = (name, type = 'formation') => {
    const normalizedName = name?.toLowerCase() || '';
    
    // Geological Periods / Systems
    if (type === 'system') {
        if (normalizedName.includes('tertiary')) return '#F2F91D'; // Yellow
        if (normalizedName.includes('cretaceous')) return '#80CF1F'; // Green
        if (normalizedName.includes('jurassic')) return '#34B2C9'; // Blue
        if (normalizedName.includes('triassic')) return '#812B92'; // Purple
        if (normalizedName.includes('permian')) return '#F04028'; // Red
        if (normalizedName.includes('carboniferous')) return '#67A599'; // Gray-Green
        if (normalizedName.includes('devonian')) return '#CB8C37'; // Brown
        if (normalizedName.includes('silurian')) return '#B3E1B6'; // Light Green
        if (normalizedName.includes('ordovician')) return '#009270'; // Teal
        if (normalizedName.includes('cambrian')) return '#7FA056'; // Olive
        return '#D1D5DB'; // Grey
    }

    // Common Lithologies / Formations (Generic mapping)
    if (normalizedName.includes('sand')) return '#F5F5DC'; // Beige
    if (normalizedName.includes('shale') || normalizedName.includes('clay')) return '#9CA3AF'; // Gray
    if (normalizedName.includes('lime') || normalizedName.includes('carbonate')) return '#60A5FA'; // Blueish
    if (normalizedName.includes('salt')) return '#F472B6'; // Pink
    if (normalizedName.includes('coal')) return '#1F2937'; // Black/Dark
    if (normalizedName.includes('chalk')) return '#E5E7EB'; // White/Light Gray

    // Fallback based on name hash or random for distinctiveness if needed
    return '#94A3B8'; // Slate 400
};

export const getLithologyPattern = (lithology) => {
    const normalized = lithology?.toLowerCase() || '';
    if (normalized.includes('sand')) return 'dots';
    if (normalized.includes('shale')) return 'lines';
    if (normalized.includes('lime')) return 'bricks';
    if (normalized.includes('salt')) return 'crosshatch';
    return 'solid';
};