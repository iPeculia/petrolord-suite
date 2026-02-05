
/* eslint-env jest */
/* global describe, test, expect, beforeEach, jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HelpCenter from '@/components/earthmodel/help/HelpCenter';
import { HelpProvider, useHelp } from '@/context/HelpContext';

// A test component to trigger the help center opening
const TestTrigger = () => {
  const { toggleHelp } = useHelp();
  return <button onClick={toggleHelp}>Open Help</button>;
};

describe('HelpSearch', () => {
  test('search input updates query', () => {
    render(
      <HelpProvider>
        <TestTrigger />
        <HelpCenter />
      </HelpProvider>
    );

    // Open help
    fireEvent.click(screen.getByText('Open Help'));

    // Find search input
    const input = screen.getByPlaceholderText('Search documentation...');
    expect(input).toBeInTheDocument();

    // Type query
    fireEvent.change(input, { target: { value: 'Seismic' } });
    expect(input.value).toBe('Seismic');
  });
});
