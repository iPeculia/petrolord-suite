export const getCommonChartProps = () => ({
  margin: { top: 5, right: 30, left: 20, bottom: 20 },
});

export const getGridConfig = () => ({
  stroke: 'rgba(255, 255, 255, 0.1)',
  strokeDasharray: '3 3',
});

export const getTooltipStyle = () => ({
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
    color: '#cbd5e1',
    padding: '8px 12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

export const getProperlyInvertedDepthAxisConfig = () => ({
  type: 'number',
  scale: 'linear',
  domain: ['dataMax', 'dataMin'],
  reversed: true,
  allowDataOverflow: true,
  tick: { fill: '#94a3b8', fontSize: 12 },
  axisLine: { stroke: '#475569' },
  tickLine: { stroke: '#475569' },
  label: { value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#cbd5e1', dy: 80, fontSize: 14 },
});

export const getDepthAxisConfig = getProperlyInvertedDepthAxisConfig;

export const getPressureAxisConfig = (label, domain = ['auto', 'auto']) => ({
  type: 'number',
  domain: domain,
  tick: { fill: '#94a3b8', fontSize: 12 },
  axisLine: { stroke: '#475569' },
  tickLine: { stroke: '#475569' },
  label: { value: label, position: 'insideBottom', fill: '#cbd5e1', dy: 15, fontSize: 14 },
});