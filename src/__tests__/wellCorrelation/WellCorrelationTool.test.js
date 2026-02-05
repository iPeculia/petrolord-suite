/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WellCorrelationTool from '../../pages/apps/WellCorrelationTool';

// Mock ResizeObserver which is used by resizable panels
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('WellCorrelationTool Page', () => {
  it('renders the main layout elements', () => {
    render(
      <MemoryRouter>
        <WellCorrelationTool />
      </MemoryRouter>
    );

    expect(screen.getByText(/Well Correlation Tool/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Wells/i)).toBeInTheDocument(); // Sidebar
    expect(screen.getByText(/Display Settings/i)).toBeInTheDocument(); // Right sidebar
    expect(screen.getByText(/Activity Log/i)).toBeInTheDocument(); // Bottom panel
  });
});