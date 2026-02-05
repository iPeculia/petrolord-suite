#!/bin/bash

# Rollback Script

echo "⚠️ INITIATING ROLLBACK ⚠️"

if [ -f "src/layouts/DashboardLayout.jsx.bak" ]; then
    echo "Restoring DashboardLayout..."
    mv src/layouts/DashboardLayout.jsx.bak src/layouts/DashboardLayout.jsx
else
    echo "❌ Backup for DashboardLayout not found!"
fi

if [ -f "src/components/DashboardSidebar.jsx.bak" ]; then
    echo "Restoring DashboardSidebar..."
    mv src/components/DashboardSidebar.jsx.bak src/components/DashboardSidebar.jsx
else
    echo "❌ Backup for DashboardSidebar not found!"
fi

echo "🔄 Rollback steps executed. Verify application state."