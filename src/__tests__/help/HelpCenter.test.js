
/* eslint-env jest */
/* global describe, test, expect, beforeEach, jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HelpCenter from '@/components/earthmodel/help/HelpCenter';
import { HelpProvider } from '@/context/HelpContext';
import { helpService } from '@/services/help/helpService';

// Mock the help service
jest.mock('@/services/help/helpService', () => ({
  helpService: {
    getArticle: jest.fn(),
    searchArticles: jest.fn()
  }
}));

const mockArticle = {
  id: '1',
  title: 'Test Article',
  content: 'This is a test article content.',
  category: 'Testing',
  difficulty: 'Easy'
};

const renderHelpCenter = () => {
  return render(
    <HelpProvider>
      <HelpCenter />
    </HelpProvider>
  );
};

describe('HelpCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders help center closed by default', () => {
    renderHelpCenter();
    // Sheet content is usually not in the document when closed, or hidden
    // Radix UI keeps it out of DOM or hidden.
    const title = screen.queryByText('Help Center');
    expect(title).not.toBeInTheDocument();
  });
});
