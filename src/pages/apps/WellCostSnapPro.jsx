import React from 'react';
import { Navigate } from 'react-router-dom';

const WellCostSnapPro = () => {
  return <Navigate to="/dashboard/drilling/wells?tab=costing" replace />;
};

export default WellCostSnapPro;