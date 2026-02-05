
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MaterialBalanceProvider, MaterialBalanceContext } from '@/contexts/MaterialBalanceContext';

// Test component to consume context
const TestComponent = () => {
  const context = useContext(MaterialBalanceContext);
  return (
    <div>
      <span data-testid="tank">{context.currentTank}</span>
      <button onClick={() => context.setCurrentTank('Test Tank')}>Change Tank</button>
    </div>
  );
};

describe('MaterialBalanceContext', () => {
  it('provides default values', () => {
    render(
      <MaterialBalanceProvider>
        <TestComponent />
      </MaterialBalanceProvider>
    );
    expect(screen.getByTestId('tank')).toHaveTextContent('Tank 1');
  });

  it('updates state via actions', () => {
    render(
      <MaterialBalanceProvider>
        <TestComponent />
      </MaterialBalanceProvider>
    );
    
    const button = screen.getByText('Change Tank');
    act(() => {
      button.click();
    });
    
    expect(screen.getByTestId('tank')).toHaveTextContent('Test Tank');
  });
});
