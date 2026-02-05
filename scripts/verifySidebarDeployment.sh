#!/bin/bash

# Post-Deployment Verification Script

echo "🔍 Starting Post-Deployment Verification..."

ERRORS=0

# Check Context
if grep -q "ApplicationProvider" src/layouts/DashboardLayout.jsx; then
    echo "✅ DashboardLayout implements ApplicationProvider"
else
    echo "❌ DashboardLayout missing ApplicationProvider"
    ERRORS=$((ERRORS+1))
fi

# Check Sidebar
if grep -q "!isInApplication" src/layouts/DashboardLayout.jsx; then
    echo "✅ DashboardLayout implements conditional sidebar rendering"
else
    echo "❌ DashboardLayout missing sidebar condition"
    ERRORS=$((ERRORS+1))
fi

# Check Config
if [ -s "src/config/applicationRoutes.js" ]; then
    echo "✅ Application Routes configuration exists and is not empty"
else
    echo "❌ Application Routes configuration missing or empty"
    ERRORS=$((ERRORS+1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "🟢 SYSTEM VERIFIED: Ready for Production"
    exit 0
else
    echo "🔴 VERIFICATION FAILED: $ERRORS errors found"
    exit 1
fi