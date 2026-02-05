
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import NotificationCenter from '@/components/earthmodel/notifications/NotificationCenter';
import { renderWithProviders } from '../utils/testHelpers';

describe('Notification Center - Detailed Unit Tests', () => {
  const mockNotifications = [
    { id: 1, title: 'Test Alert', message: 'Details', type: 'info', read: false }
  ];

  test('Test 1: Notification center initialization', () => {
    renderWithProviders(<NotificationCenter />, { notificationProps: { notifications: mockNotifications, unreadCount: 1 } });
    const bell = screen.getByRole('button');
    expect(bell).toBeInTheDocument();
  });

  test('Test 2: Notification management', () => {
    const mockMarkRead = jest.fn();
    renderWithProviders(<NotificationCenter />, { 
      notificationProps: { notifications: mockNotifications, markAsRead: mockMarkRead } 
    });
    
    // Open popover
    fireEvent.click(screen.getByRole('button'));
    
    const item = screen.getByText('Test Alert');
    fireEvent.click(item);
    
    expect(mockMarkRead).toHaveBeenCalledWith(1);
  });

  test('Test 3: Empty state', () => {
    renderWithProviders(<NotificationCenter />, { notificationProps: { notifications: [] } });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });
});
