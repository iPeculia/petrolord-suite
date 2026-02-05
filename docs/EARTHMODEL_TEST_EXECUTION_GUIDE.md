# EarthModel Pro: Test Execution Guide

## 1. Overview
This guide details how to execute the comprehensive test suite for EarthModel Pro.

## 2. Prerequisites
*   Node.js v20+
*   NPM v9+
*   Jest installed (via `npm install`)

## 3. Running Tests

### Unit Tests
Run all unit tests:
\`\`\`bash
npm test
\`\`\`

Run specific suite:
\`\`\`bash
npm test src/__tests__/help/
\`\`\`

### Integration Tests
\`\`\`bash
npm test src/__tests__/integration/
\`\`\`

### Coverage Report
Generate a coverage report to ensure >80% target:
\`\`\`bash
npm test -- --coverage
\`\`\`

## 4. Interpreting Results
*   **PASS**: Feature is working as expected.
*   **FAIL**: Check the stack trace. Common issues include missing mocks or changed component props.
*   **Snapshots**: If a UI snapshot fails, verify if the UI change was intentional before updating snapshots with \`u\`.