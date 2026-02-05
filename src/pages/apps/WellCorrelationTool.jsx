import React, { useEffect } from 'react';
import WellCorrelationLayout from '@/components/wellCorrelation/WellCorrelationLayout';
import { WellCorrelationProvider } from '@/contexts/WellCorrelationContext';
import { TrackConfigurationProvider } from '@/contexts/TrackConfigurationContext';
import { Helmet } from 'react-helmet';
import { useApplication } from '@/context/ApplicationContext';

const WellCorrelationTool = () => {
  // Use Application context to control sidebar visibility if available
  const applicationContext = useApplication();
  const setIsInApplication = applicationContext?.setIsInApplication || (() => {});

  useEffect(() => {
    // Hide the main sidebar when this app is mounted
    setIsInApplication(true);
    
    // Show sidebar again when unmounting (navigating away)
    return () => setIsInApplication(false);
  }, [setIsInApplication]);

  return (
    <>
      <Helmet>
        <title>Well Correlation Pro - Petrolord</title>
        <meta name="description" content="Interactively correlate well logs, create cross-sections, and visualize subsurface data with Petrolord's advanced Well Correlation Pro." />
      </Helmet>
      <WellCorrelationProvider>
        <TrackConfigurationProvider>
          <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
            <WellCorrelationLayout />
          </div>
        </TrackConfigurationProvider>
      </WellCorrelationProvider>
    </>
  );
};

export default WellCorrelationTool;