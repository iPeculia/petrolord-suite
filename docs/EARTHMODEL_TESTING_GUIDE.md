# EarthModel Pro Testing Guide

## Overview
This document outlines the testing strategy for EarthModel Pro, covering Unit, Integration, and E2E testing protocols.

## Testing Stack
*   **Runner**: Jest (configured for React/Vite environment)
*   **Assertions**: @testing-library/jest-dom
*   **Components**: @testing-library/react
*   **Mocks**: Custom mocks for Supabase, Services, and Contexts

## Running Tests
*   `npm test`: Run all tests
*   `npm run test:watch`: Run tests in watch mode
*   `npm run test:coverage`: Generate coverage report

## Directory Structure
*   `src/__tests__/`: Root testing directory
    *   `help/`: Help System tests
    *   `training/`: Training System tests
    *   `settings/`: Settings & Config tests
    *   `notifications/`: Alert system tests
    *   `utils/`: Test helpers and mock data

## Best Practices
1.  **Test Behavior, Not Implementation**: Focus on what the user sees and does.
2.  **Mock External Services**: Never make real API calls in unit tests. Use `jest.mock`.
3.  **Context Wrappers**: Use `renderWithProviders` helper to wrap components in necessary Context Providers.
4.  **Accessibility**: Use `axe-core` checks in component tests where possible.

## Coverage Targets
*   Statements: 80%
*   Branches: 75%
*   Functions: 80%
*   Lines: 80%