
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import SettingsPanel from '@/components/earthmodel/settings/SettingsPanel';
import { renderWithProviders } from '../utils/testHelpers';

describe('Settings Panel - Detailed Unit Tests', () => {
  test('Test 1: Settings panel initialization', () => {
    renderWithProviders(<SettingsPanel />, { settingsProps: { isOpen: true } });
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('General Preferences')).toBeInTheDocument(); // Default tab
  });

  test('Test 2: General settings', () => {
    const mockUpdate = jest.fn();
    renderWithProviders(<SettingsPanel />, { settingsProps: { isOpen: true, updateSetting: mockUpdate } });
    
    // Check language label
    expect(screen.getByText('Language')).toBeInTheDocument();
    // Note: Radix UI Select requires more complex interaction testing, often checking for triggers
  });

  test('Test 3: Display settings', async () => {
    renderWithProviders(<SettingsPanel />, { settingsProps: { isOpen: true } });
    
    const displayTab = screen.getByText('Display');
    fireEvent.click(displayTab);
    
    expect(screen.getByText('Display Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  test('Test 4: Notification settings', () => {
    const mockUpdate = jest.fn();
    renderWithProviders(<SettingsPanel />, { 
      settingsProps: { isOpen: true, updateSetting: mockUpdate, settings: { notifications: false } } 
    });
    
    fireEvent.click(screen.getByText('Notifications'));
    
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    
    expect(mockUpdate).toHaveBeenCalledWith('notifications', true);
  });

  test('Test 5: Data settings', () => {
    renderWithProviders(<SettingsPanel />, { settingsProps: { isOpen: true } });
    fireEvent.click(screen.getByText('Data & Storage'));
    expect(screen.getByText('Auto-Save')).toBeInTheDocument();
  });
});
