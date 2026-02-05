/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
import { parseLAS } from '@/utils/wellCorrelation/lasParser';

// Mock FileReader since we run in Node/Jest environment
class MockFileReader {
  readAsText(blob) {
    if (blob.shouldFail) {
      this.onerror(new Error('Read error'));
    } else {
      this.onload({ target: { result: blob.content } });
    }
  }
}
global.FileReader = MockFileReader;

describe('LAS Parser (Phase 5A)', () => {
  const validLas2 = `~VERSION INFORMATION
 VERS.                          2.0 :   CWLS LOG ASCII STANDARD -VERSION 2.0
 WRAP.                          NO  :   ONE LINE PER DEPTH STEP
~WELL INFORMATION
#MNEM.UNIT              DATA                       DESCRIPTION
#----.----              ----                       -----------
 STRT.M                 1000.0000                  :START DEPTH
 STOP.M                 1010.0000                  :STOP DEPTH
 STEP.M                 0.5000                     :STEP
 NULL.                  -999.25                    :NULL VALUE
 COMP.                  COMPANY                    :COMPANY
 WELL.                  TEST WELL 1                :WELL
 FLD .                  TEST FIELD                 :FIELD
 LOC .                  123-456                    :LOCATION
 CTRY.                  USA                        :COUNTRY
 DATE.                  2023-01-01                 :LOG DATE
~CURVE INFORMATION
#MNEM.UNIT              API CODE                   CURVE DESCRIPTION
#----.----              --------                   -----------------
 DEPT.M                                            :DEPTH
 GR  .GAPI                                         :GAMMA RAY
 RHOB.G/C3                                         :BULK DENSITY
~PARAMETER INFORMATION
#MNEM.UNIT              VALUE                      DESCRIPTION
#----.----              -----                      -----------
~Other Information
~ASCII LOG DATA
 1000.0   50.5   2.45
 1000.5   52.1   2.44
 1001.0   55.3   2.46
 1001.5   -999.25 2.48
`;

  it('parses basic LAS 2.0 unwrapped correctly', async () => {
    const file = { name: 'test.las', content: validLas2 };
    const result = await parseLAS(file);

    expect(result).toBeDefined();
    expect(result.metadata.name).toBe('TEST WELL 1');
    expect(result.metadata.startDepth).toBe(1000);
    expect(result.metadata.depthUnit).toBe('M');
    expect(result.curves).toHaveLength(3); // DEPT, GR, RHOB
    expect(result.curves[1].mnemonic).toBe('GR');
    expect(result.curves[1].data[0]).toBe(50.5);
    expect(result.curves[1].data[3]).toBeNaN(); // Null value handling
  });

  it('extracts metadata correctly', async () => {
    const file = { name: 'test.las', content: validLas2 };
    const result = await parseLAS(file);
    
    expect(result.metadata.field).toBe('TEST FIELD');
    expect(result.metadata.country).toBe('USA');
    expect(result.metadata.operator).toBe('COMPANY');
  });

  it('handles null values', async () => {
    const file = { name: 'test.las', content: validLas2 };
    const result = await parseLAS(file);
    
    const grData = result.curves[1].data;
    expect(isNaN(grData[3])).toBe(true);
  });

  it('handles missing data section gracefully', async () => {
    const badLas = `~VERSION\nVERS. 2.0\n~WELL\nWELL. TEST\n`;
    const file = { name: 'bad.las', content: badLas };
    
    await expect(parseLAS(file)).rejects.toThrow('No data section');
  });
});