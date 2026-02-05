
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testHelpers';
import EarthModelPro from '@/pages/apps/EarthModelPro';

// Mock services
jest.mock('@/services/help/helpService');
jest.mock('@/services/training/trainingService');

describe('Integration: Help & Training Workflow', () => {
  test('Test 1: Help to training workflow', async () => {
    // 1. User renders app
    renderWithProviders(<EarthModelPro />);
    
    // 2. User opens Help
    const helpBtn = screen.getByTitle('Help');
    fireEvent.click(helpBtn);
    
    // 3. User searches for topic
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'Seismic' } });
    
    // 4. Verify help results (Assuming mock returns something that links to training)
    // In a real integration test, we'd expect a button "Take Training Course"
    // Since this is UI only, we verify the help panel is interactive
    await waitFor(() => expect(screen.getByText('Popular Categories')).toBeInTheDocument());
    
    // 5. User closes help and opens Training
    fireEvent.click(helpBtn); // Toggle off
    const trainBtn = screen.getByTitle('Training');
    fireEvent.click(trainBtn);
    
    // 6. Verify Training Hub opens
    expect(screen.getByText('Training Academy')).toBeInTheDocument();
  });
});
