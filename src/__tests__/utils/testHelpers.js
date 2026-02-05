import React from 'react';
import { render } from '@testing-library/react';
import { HelpProvider } from '@/context/HelpContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { TrainingProvider } from '@/context/TrainingContext';

// Helper to render components with all necessary providers
export const renderWithProviders = (ui, { 
  helpProps = {}, 
  notificationProps = {}, 
  settingsProps = {},
  trainingProps = {},
  ...renderOptions 
} = {}) => {
  const Wrapper = ({ children }) => (
    <SettingsProvider {...settingsProps}>
      <NotificationProvider {...notificationProps}>
        <HelpProvider {...helpProps}>
          <TrainingProvider {...trainingProps}>
            {children}
          </TrainingProvider>
        </HelpProvider>
      </NotificationProvider>
    </SettingsProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};