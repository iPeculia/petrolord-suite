
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApplicationProvider } from '@/context/ApplicationContext';
import DashboardLayout from '@/layouts/DashboardLayout'; // Testing the main layout
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock sidebar to simplify test
jest.mock('@/components/DashboardSidebar', () => {
  return function DummySidebar() {
    return <div data-testid="dashboard-sidebar">Sidebar Content</div>;
  };
});

describe('Sidebar Visibility System', () => {
  
  test('Sidebar is visible by default', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<div>Dashboard Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
  });

});
