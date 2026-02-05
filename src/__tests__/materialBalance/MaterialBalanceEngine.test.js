
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import { calculateF, calculateEo, calculateEg } from '../../utils/materialBalance/MaterialBalanceEngine';

describe('Material Balance Engine', () => {
  
  test('calculateF computes withdrawal correctly', () => {
    // F = Np*Bo + (Gp - Np*Rp)*Bg + Wp*Bw
    // Assumed: Np=1000, Bo=1.2, Gp=500000, Rp=500, Bg=0.001, Wp=0, Bw=1
    // F = 1000*1.2 + (500000 - 1000*500)*0.001 + 0 = 1200 + 0 = 1200
    const inputs = {
      Np: 1000, Gp: 500000, Wp: 0, 
      Bo: 1.2, Bg: 0.001, Bw: 1.0, 
      Rs: 500, Rp: 500 // Rp = Gp/Np = 500
    };
    const F = calculateF(inputs.Np, inputs.Gp, inputs.Wp, inputs.Bo, inputs.Bg, inputs.Bw, inputs.Rs, 0, inputs.Rp, 1.1, 0.0009, 500, 0);
    
    expect(F).toBeCloseTo(1200, 1);
  });

  test('calculateEo computes oil expansion', () => {
    // Eo = (Bo - Boi) + (Rsi - Rs) * Bg
    // Bo=1.3, Boi=1.2, Rsi=500, Rs=400, Bg=0.002
    // Eo = (1.3 - 1.2) + (500 - 400) * 0.002 = 0.1 + 100*0.002 = 0.1 + 0.2 = 0.3
    const val = calculateEo(1.3, 1.2, 400, 500, 0.002);
    expect(val).toBeCloseTo(0.3, 4);
  });

});
