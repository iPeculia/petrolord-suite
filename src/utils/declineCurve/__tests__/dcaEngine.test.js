
/* eslint-env jest */
/* global describe, test, expect */
// Note: These tests require a Jest environment. 
// This file serves as the implementation for the requirement.

import { calculateArpsExponential, calculateArpsHyperbolic, calculateEUR } from '../dcaEngine';

describe('DCA Engine', () => {
  
  describe('Rate Calculations', () => {
    test('Exponential Decline should calculate correctly', () => {
      const qi = 1000;
      const Di = 0.1;
      const t = 10;
      // q = 1000 * exp(-0.1 * 10) = 1000 * 0.3678 = 367.8
      const rate = calculateArpsExponential(qi, Di, t);
      expect(rate).toBeCloseTo(367.88, 1);
    });

    test('Hyperbolic Decline should calculate correctly', () => {
      const qi = 1000;
      const Di = 0.1;
      const b = 0.5;
      const t = 10;
      // q = 1000 / (1 + 0.5 * 0.1 * 10)^(1/0.5) = 1000 / (1.5)^2 = 1000 / 2.25 = 444.44
      const rate = calculateArpsHyperbolic(qi, Di, b, t);
      expect(rate).toBeCloseTo(444.44, 1);
    });
  });

  describe('EUR Calculations', () => {
    test('Exponential EUR should calculate correctly', () => {
      const qi = 1000;
      const Di = 0.001; // Daily decline
      const q_limit = 10;
      const model = 'Exponential';
      // EUR = (qi - q_limit) / Di = (1000 - 10) / 0.001 = 990000
      const eur = calculateEUR(qi, Di, 0, q_limit, model);
      expect(eur).toBeCloseTo(990000, 0);
    });
  });
});
