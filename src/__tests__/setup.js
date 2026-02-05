
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import '@testing-library/jest-dom';

// Setup for Jest
// We are running in a Jest environment as per package.json

if (typeof global.jest === 'undefined') {
  // Fallback mock if jest is not present (unlikely in test env)
  global.jest = {
    fn: () => { const fn = () => {}; fn.mock = { calls: [] }; return fn; },
    mock: () => {},
    spyOn: () => ({ mockImplementation: () => {} }),
    useFakeTimers: () => {},
    runAllTimers: () => {},
    clearAllMocks: () => {}
  };
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock import.meta.env for Vite environment variables in tests
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'mock-key',
    }
  }
};

// Polyfill for TextEncoder/Decoder if missing in JSDOM
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
