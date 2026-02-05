import React from 'react';
import InteractiveGuide from './InteractiveGuide';

const OnboardingFlow = ({ isActive, onComplete }) => {
  const steps = [
    {
      title: "Welcome to Economics Studio",
      content: "This application helps you evaluate upstream oil & gas projects. You can model production, costs, and fiscal terms to calculate NPV, IRR, and other key metrics.",
      targetId: null // Center screen
    },
    {
      title: "Project & Scenario Management",
      content: "Start here. The header shows your current project and model. You can switch scenarios or lock them for approval using the status badge.",
      targetId: "workspace-header-info" 
    },
    {
      title: "Navigation Tabs",
      content: "Work through these tabs sequentially. Define settings, input production profiles, add costs, and configure fiscal terms before viewing results.",
      targetId: "workspace-tabs"
    },
    {
      title: "Run & Save",
      content: "Changes are auto-saved, but you can manually trigger a calculation and save point here. Watch the status indicator for feedback.",
      targetId: "workspace-save-btn" 
    },
    {
      title: "Need Help?",
      content: "Access the Help Center anytime for glossaries, tutorials, and FAQs. You can also replay this tour from the settings menu or by pressing '?'.",
      targetId: "workspace-help-btn"
    }
  ];

  return (
    <InteractiveGuide 
      steps={steps}
      isOpen={isActive}
      onClose={onComplete}
      onComplete={onComplete}
    />
  );
};

export default OnboardingFlow;