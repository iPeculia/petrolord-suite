import React from 'react';
import { Navigate } from 'react-router-dom';

const WellCostIQ = () => {
  return <Navigate to="/dashboard/drilling/wells?tab=costing" replace />;
};

export default WellCostIQ;