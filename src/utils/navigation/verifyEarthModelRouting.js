import { earthModelProMetadata } from '../../config/apps/earthmodel-pro-metadata';

export const verifyEarthModelRouting = () => {
  const report = {
    checks: [],
    status: 'PENDING',
    errors: []
  };

  // 1. Verify Metadata Path
  const expectedRoute = '/dashboard/apps/geoscience/earth-model-pro';
  const metadataCheck = {
    name: 'Metadata Route Check',
    passed: earthModelProMetadata.route === expectedRoute,
    actual: earthModelProMetadata.route,
    expected: expectedRoute
  };
  report.checks.push(metadataCheck);

  // 2. Verify Category
  const categoryCheck = {
    name: 'Category Check',
    passed: earthModelProMetadata.category === 'Structural',
    actual: earthModelProMetadata.category
  };
  report.checks.push(categoryCheck);

  // 3. Verify Status
  const statusCheck = {
    name: 'Status Check',
    passed: earthModelProMetadata.status === 'Available',
    actual: earthModelProMetadata.status
  };
  report.checks.push(statusCheck);

  // Final Assessment
  const allPassed = report.checks.every(c => c.passed);
  report.status = allPassed ? 'PASSED' : 'FAILED';
  
  if (!allPassed) {
    report.errors = report.checks.filter(c => !c.passed).map(c => `${c.name} failed. Expected ${c.expected}, got ${c.actual}`);
  }

  console.log('EarthModel Pro Routing Verification:', report);
  return report;
};