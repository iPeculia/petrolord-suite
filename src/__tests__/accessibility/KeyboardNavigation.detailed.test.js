
/* global describe, test, expect, global */
/* eslint-env jest, node */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import AppHeader from '@/components/earthmodel/AppHeader';
import { renderWithProviders } from '../utils/testHelpers';

// Ensure process is defined for any dependencies that might need it
if (typeof process === 'undefined') {
  global.process = { env: {} };
}

describe('Accessibility: Keyboard Navigation', () => {
  test('Header elements are tab-accessible', () => {
    renderWithProviders(<AppHeader activeProject={{name: 'Test'}} />);
    
    // Simulate Tab key
    // Note: Full tab simulation is hard in JSDOM, usually we check for tabIndex or button roles
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).not.toHaveAttribute('tabIndex', '-1');
    });
  });
});
