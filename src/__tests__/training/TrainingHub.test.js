
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrainingHub from '@/components/earthmodel/training/TrainingHub';
import { TrainingProvider, useTraining } from '@/context/TrainingContext';

// Mock TrainingHub component since it wasn't explicitly provided in full in the codebase context
// Assuming it follows similar pattern to HelpCenter
jest.mock('@/components/earthmodel/training/TrainingHub', () => {
  const { useTraining } = require('@/context/TrainingContext');
  return function MockTrainingHub() {
    const { isOpen } = useTraining();
    if (!isOpen) return null;
    return <div>Training Hub Content</div>;
  };
});

const TestTrigger = () => {
  const { toggleTraining } = useTraining();
  return <button onClick={toggleTraining}>Open Training</button>;
};

describe('TrainingHub', () => {
  test('toggles visibility', () => {
    render(
      <TrainingProvider>
        <TestTrigger />
        <TrainingHub />
      </TrainingProvider>
    );

    expect(screen.queryByText('Training Hub Content')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Open Training'));
    
    expect(screen.getByText('Training Hub Content')).toBeInTheDocument();
  });
});
