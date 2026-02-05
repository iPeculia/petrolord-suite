import React from 'react';
import InteractiveGuide from './InteractiveGuide';

const DashboardTutorial = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "Key Performance Indicators (KPIs)",
      content: "These cards show the high-level health of your project. NPV indicates total value creation, while IRR shows efficiency. Green indicates positive/healthy metrics.",
      targetId: "kpi-section"
    },
    {
      title: "Production Forecast",
      content: "Visualizes the oil (green) and gas (red) production rates over time. Toggle between Daily Rates and Cumulative volumes using the switch in the header.",
      targetId: "production-chart"
    },
    {
      title: "Cost Profile (CAPEX/OPEX)",
      content: "Shows annual expenditure. Blue bars represent capital investment (drilling, facilities), while orange bars show operating costs.",
      targetId: "cost-chart"
    },
    {
      title: "Cashflow Analysis",
      content: "The most critical chart. Bars show annual net cashflow (revenue minus all costs/taxes). The line tracks cumulative cash position—payback occurs when this line crosses zero.",
      targetId: "cashflow-chart"
    },
    {
      title: "Project Value Waterfall",
      content: "Explains where the money goes. Starts with Gross Revenue and subtracts Royalties, Costs, and Taxes to arrive at the final Net Value.",
      targetId: "waterfall-chart"
    }
  ];

  return (
    <InteractiveGuide 
      steps={steps}
      isOpen={isOpen}
      onClose={onClose}
      onComplete={onClose}
    />
  );
};

export default DashboardTutorial;