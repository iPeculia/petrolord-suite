
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import TrainingHub from '@/components/earthmodel/training/TrainingHub';
import { renderWithProviders } from '../utils/testHelpers';
import { trainingService } from '@/services/training/trainingService';

jest.mock('@/services/training/trainingService');

describe('Training Hub - Detailed Unit Tests', () => {
  const mockCourses = [
    { id: 'c1', title: 'EarthModel Fundamentals', modules: [] },
    { id: 'c2', title: 'Seismic Interpretation', modules: [] }
  ];

  beforeEach(() => {
    trainingService.getCourse.mockResolvedValue(mockCourses[0]);
  });

  test('Test 1: Training hub initialization', () => {
    renderWithProviders(<TrainingHub />, { trainingProps: { isOpen: true } });
    expect(screen.getByText('Training Academy')).toBeInTheDocument();
    expect(screen.getByText('Available Courses')).toBeInTheDocument();
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
  });

  test('Test 2: Course browsing', () => {
    renderWithProviders(<TrainingHub />, { trainingProps: { isOpen: true } });
    expect(screen.getByText('EarthModel Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Seismic Interpretation')).toBeInTheDocument();
  });

  test('Test 3: Course enrollment', async () => {
    const mockStart = jest.fn();
    renderWithProviders(<TrainingHub />, { trainingProps: { isOpen: true, startCourse: mockStart } });
    
    const startBtns = screen.getAllByText('Start');
    fireEvent.click(startBtns[0]);
    
    expect(mockStart).toHaveBeenCalledWith('earthmodel-101');
  });

  test('Test 4: Progress tracking', () => {
    renderWithProviders(<TrainingHub />, { trainingProps: { isOpen: true } });
    // Check for progress bars
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  test('Test 5: Achievement display', () => {
    renderWithProviders(<TrainingHub />, { trainingProps: { isOpen: true } });
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByTitle('First Login')).toBeInTheDocument();
  });
});
