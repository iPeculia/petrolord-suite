
/* eslint-env jest */
/* global jest, describe, test, it, expect, beforeEach, beforeAll, afterEach, afterAll, require, global */
/**
 * @jest-environment jsdom
 */
import { createProject, saveProject, loadProject } from '../../utils/materialBalance/MBDataPersistence';
import { set, get } from 'idb-keyval';

// Mock idb-keyval
jest.mock('idb-keyval');

describe('Data Persistence', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createProject saves a new project structure', async () => {
    const name = 'Test Project';
    const type = 'Oil';
    
    await createProject(name, type);
    
    expect(set).toHaveBeenCalled();
    const savedCall = set.mock.calls[0];
    expect(savedCall[0]).toContain('mb_proj_'); // Key
    expect(savedCall[1].name).toBe(name);       // Value
    expect(savedCall[1].type).toBe(type);
  });

  test('loadProject retrieves data', async () => {
    const mockData = { id: '123', name: 'Existing' };
    get.mockResolvedValue(mockData);
    
    const data = await loadProject('123');
    expect(get).toHaveBeenCalledWith('mb_proj_123');
    expect(data).toEqual(mockData);
  });

});
