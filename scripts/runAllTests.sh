#!/bin/bash

echo "Starting Full Test Suite for EarthModel Pro..."

# 1. Run Linting
echo "Running Lint..."
npm run lint

# 2. Run Unit Tests
echo "Running Unit Tests..."
npm test -- --testPathPattern="detailed.test.js"

# 3. Run Integration Tests
echo "Running Integration Tests..."
npm test -- --testPathPattern="integration"

echo "All tests execution attempt completed."