
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import { renderHook } from '@testing-library/react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { MaterialBalanceProvider } from '@/contexts/MaterialBalanceContext';

describe('useMaterialBalance', () => {
  it('throws error if used outside provider', () => {
    // Suppress console error for this test as it's expected
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => renderHook(() => useMaterialBalance())).toThrow('useMaterialBalance must be used within a MaterialBalanceProvider');
    
    console.error = originalError;
  });

  it('returns context values inside provider', () => {
    const wrapper = ({ children }) => <MaterialBalanceProvider>{children}</MaterialBalanceProvider>;
    const { result } = renderHook(() => useMaterialBalance(), { wrapper });
    
    expect(result.current.currentTank).toBe('Tank 1');
    expect(typeof result.current.setCurrentTank).toBe('function');
  });
});
