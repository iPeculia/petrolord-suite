/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { WellCorrelationProvider, useWellCorrelation } from '../../contexts/WellCorrelationContext';

const TestComponent = () => {
  const { state, actions, dispatch } = useWellCorrelation();
  return (
    <div>
      <span data-testid="project-name">{state.currentProject?.name || 'None'}</span>
      <button onClick={() => actions.createProject({ name: 'Test Project' })}>Create</button>
      <button onClick={() => dispatch({ type: 'ADD_WELL', payload: { id: 'w1', name: 'Well 1' } })}>Add Well</button>
      <span data-testid="well-count">{state.wells.length}</span>
    </div>
  );
};

describe('WellCorrelationContext', () => {
  it('provides initial state', () => {
    render(
      <WellCorrelationProvider>
        <TestComponent />
      </WellCorrelationProvider>
    );
    expect(screen.getByTestId('project-name')).toBe('None');
    expect(screen.getByTestId('well-count')).toBe('0');
  });

  // Using timers for async actions
  jest.useFakeTimers();

  it('creates a project', async () => {
    render(
      <WellCorrelationProvider>
        <TestComponent />
      </WellCorrelationProvider>
    );
    
    act(() => {
      screen.getByText('Create').click();
      jest.runAllTimers();
    });
  });

  it('adds a well', () => {
    render(
      <WellCorrelationProvider>
        <TestComponent />
      </WellCorrelationProvider>
    );
    
    act(() => {
      screen.getByText('Add Well').click();
    });
    
    expect(screen.getByTestId('well-count')).toBe('1');
  });
});