
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import { parseLAS } from '../../utils/wellCorrelation/lasParser';

describe('LAS Parser', () => {
  it('exports a parseLAS function', () => {
    expect(typeof parseLAS).toBe('function');
  });
});
