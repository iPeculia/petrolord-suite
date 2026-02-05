/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import { convertDepth } from '../../utils/wellCorrelation/depthHandler';
import { getLogColor } from '../../utils/wellCorrelation/colorPalettes';
import { validateTrackConfig } from '../../utils/wellCorrelation/trackConfig';

describe('Well Correlation Utilities', () => {
  describe('depthHandler', () => {
    it('converts Meters to Feet correctly', () => {
      const m = 10;
      const ft = convertDepth(m, 'M', 'FT');
      expect(ft).toBeCloseTo(32.8084, 4);
    });

    it('converts Feet to Meters correctly', () => {
      const ft = 32.8084;
      const m = convertDepth(ft, 'FT', 'M');
      expect(m).toBeCloseTo(10, 4);
    });

    it('returns same value if units match', () => {
      expect(convertDepth(100, 'M', 'M')).toBe(100);
    });
  });

  describe('colorPalettes', () => {
    it('returns gamma color for GR curve', () => {
      expect(getLogColor('GR')).toBe('#4CAF50');
    });
    it('returns resistivity color for RES curve', () => {
      expect(getLogColor('RES_DEEP')).toBe('#F44336');
    });
    it('returns default black for unknown curve', () => {
      expect(getLogColor('UNKNOWN')).toBe('#000000');
    });
  });

  describe('trackConfig', () => {
    it('validates correct track type', () => {
      expect(validateTrackConfig({ type: 'LOG' }).valid).toBe(true);
    });
    it('invalidates incorrect track type', () => {
      expect(validateTrackConfig({ type: 'INVALID' }).valid).toBe(false);
    });
  });
});