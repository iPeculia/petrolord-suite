
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationCenter from '@/components/earthmodel/notifications/NotificationCenter';
import { NotificationProvider } from '@/context/NotificationContext';

describe('NotificationCenter', () => {
  test('renders bell icon', () => {
    render(
      <NotificationProvider>
        <NotificationCenter />
      </NotificationProvider>
    );
    // Lucide icons often render as svg, assume button is present
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('shows notifications when clicked', () => {
    render(
      <NotificationProvider>
        <NotificationCenter />
      </NotificationProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Model Update')).toBeInTheDocument(); // From default mock state in Context
  });

  test('clear all button functionality', () => {
    render(
      <NotificationProvider>
        <NotificationCenter />
      </NotificationProvider>
    );

    // Open
    fireEvent.click(screen.getByRole('button'));
    
    const clearBtn = screen.getByText('Clear All');
    fireEvent.click(clearBtn);

    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });
});
