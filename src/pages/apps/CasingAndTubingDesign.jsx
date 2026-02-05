import React from 'react';
import { Navigate } from 'react-router-dom';

// This file is kept for backward compatibility if any direct imports exist, 
// but the main app logic has moved to CasingTubingDesignPro.
// The route in App.jsx should point directly to CasingTubingDesignPro.

const CasingAndTubingDesign = () => {
    return <Navigate to="/dashboard/apps/drilling/casing-tubing-design" replace />;
};

export default CasingAndTubingDesign;