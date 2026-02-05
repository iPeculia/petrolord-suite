
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPanel from '@/components/earthmodel/settings/SettingsPanel';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';

const TestTrigger = () => {
  const { toggleSettings } = useSettings();
  return <button onClick={toggleSettings}>Open Settings</button>;
};

describe('SettingsPanel', () => {
  test('renders all tabs', () => {
    render(
      <SettingsProvider>
        <TestTrigger />
        <SettingsPanel />
      </SettingsProvider>
    );

    fireEvent.click(screen.getByText('Open Settings'));

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Data & Storage')).toBeInTheDocument();
  });

  test('can switch tabs', () => {
    render(
      <SettingsProvider>
        <TestTrigger />
        <SettingsPanel />
      </SettingsProvider>
    );

    fireEvent.click(screen.getByText('Open Settings'));
    
    // Click Display tab
    fireEvent.click(screen.getByText('Display'));
    expect(screen.getByText('Display Settings')).toBeInTheDocument();
    
    // Click Notifications tab
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
});
