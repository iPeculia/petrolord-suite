export const generateCompetitorData = (inputs) => {
  const { competitors } = inputs;

  const kpis = [
    { title: "Top Active Company", value: "Shell" },
    { title: "Key Strategic Trend", value: "LNG Expansion" },
    { title: "Recent Major Announcement", value: "ExxonMobil FID in Guyana" },
  ];

  const mapData = [
    { company: "Shell", activity: "New exploration well spudded", position: [6.45, 3.38] }, // Lagos, Nigeria
    { company: "ExxonMobil", activity: "Increased drilling in Permian", position: [31.96, -102.17] }, // Midland, TX
    { company: "Chevron", activity: "Gorgon Stage 2 online", position: [-20.7, 115.4] }, // Western Australia
    { company: "Shell", activity: "Bonga SW Aparo development", position: [4.5, 5.0] }, // Offshore Nigeria
  ];

  const performanceChart = {
    data: [
      {
        x: competitors.map(c => c.name),
        y: [120, 110, 95],
        name: 'Wells Drilled (2023)',
        type: 'bar',
        marker: { color: '#a3e635' }
      },
      {
        x: competitors.map(c => c.name),
        y: [25000, 22000, 19000],
        name: 'CAPEX ($MM)',
        type: 'bar',
        marker: { color: '#fb923c' }
      },
    ],
    layout: {
      barmode: 'group',
      title: 'Competitor Performance Comparison',
      xaxis: { title: 'Competitor' },
      yaxis: { title: 'Value' },
    },
  };

  const keywordCloud = [
    { text: 'LNG', weight: 10 },
    { text: 'decarbonization', weight: 8 },
    { text: 'carbon capture', weight: 7 },
    { text: 'exploration', weight: 6 },
    { text: 'Permian', weight: 9 },
    { text: 'Guyana', weight: 8 },
    { text: 'FPSO', weight: 5 },
    { text: 'shareholder returns', weight: 7 },
  ];

  const newsFeed = [
    { title: "Shell Announces FID on Major Gas Project in Nigeria", snippet: "Royal Dutch Shell has taken the final investment decision on the Gbaran-Ubie Phase 2B project...", source: "#" },
    { title: "ExxonMobil Reports Record Production from Permian Assets", snippet: "ExxonMobil today announced its Permian Basin production reached a new record in Q4...", source: "#" },
    { title: "Chevron Highlights Commitment to Lower Carbon Initiatives", snippet: "In its latest sustainability report, Chevron outlined its strategy for reducing emissions...", source: "#" },
    { title: "NUPRC Releases New Guidelines for Deepwater Exploration", snippet: "The Nigerian Upstream Petroleum Regulatory Commission (NUPRC) has issued new guidelines...", source: "#" },
  ];

  const narrativeSummary = `Competitor analysis indicates a strong focus on LNG expansion and shareholder returns, particularly from Shell and Chevron. ExxonMobil continues to dominate in the Permian Basin with aggressive drilling campaigns. A key emerging theme is the strategic investment in decarbonization projects, signaling a long-term industry shift. In Nigeria, regulatory changes from NUPRC are expected to spur new deepwater activity.`;

  return {
    kpis,
    mapData,
    performanceChart,
    keywordCloud,
    newsFeed,
    narrativeSummary,
  };
};