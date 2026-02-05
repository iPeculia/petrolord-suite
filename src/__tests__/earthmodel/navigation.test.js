
/* global describe, test, expect */
/* eslint-env jest */
import { earthModelProMetadata } from '../../config/apps/earthmodel-pro-metadata';

describe('EarthModel Pro Navigation', () => {
  test('Metadata contains correct route', () => {
    expect(earthModelProMetadata.route).toBe('/dashboard/apps/geoscience/earth-model-pro');
  });

  test('Metadata has correct category and status', () => {
    expect(earthModelProMetadata.category).toBe('Structural');
    expect(earthModelProMetadata.status).toBe('Available');
  });

  test('Route format is consistent with dashboard apps', () => {
    expect(earthModelProMetadata.route.startsWith('/dashboard/')).toBe(true);
  });
});
