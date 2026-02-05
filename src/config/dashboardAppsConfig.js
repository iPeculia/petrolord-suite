import { Box, Layers, Database, Activity } from 'lucide-react';

export const dashboardAppsConfig = [
  {
    id: "earth-model-pro",
    title: "EarthModel Pro",
    category: "Structural",
    hub: "Geoscience Analytics Hub",
    route: "/dashboard/apps/geoscience/earth-model-pro",
    icon: Box,
    description: "Build structural framework for fields. Turn points, grids, faults, and polygons into 3D corner-point grids.",
    status: "available",
    version: "1.0.0",
    features: ["Surface Modeling", "Grid Building", "Volume Computation", "3D Visualization"]
  },
  // Other apps can be migrated here for a centralized config
];

export default dashboardAppsConfig;