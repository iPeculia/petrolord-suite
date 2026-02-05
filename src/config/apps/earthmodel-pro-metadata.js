import { Box, Layers, Grid, Cpu } from 'lucide-react';

export const earthModelProMetadata = {
  id: "earth-model-pro",
  name: "EarthModel Pro",
  category: "Structural",
  hub: "Geoscience Analytics Hub",
  route: "/dashboard/apps/geoscience/earth-model-pro",
  icon: Box,
  description: "Build structural framework for fields. Turn points, grids, faults, and polygons into 3D corner-point grids.",
  longDescription: "EarthModel Pro is a comprehensive 3D structural modeling suite designed for reservoir characterization. It enables geoscientists to construct watertight structural frameworks, generating high-fidelity corner-point grids from disparate data sources including seismic horizons, fault sticks, and well markers.",
  features: [
    "3D Corner-Point Grid Generation",
    "Fault Network Modeling",
    "Surface Interpolation (Kriging, IDW)",
    "Volumetric Calculation (GRV, NRV, STOIIP)",
    "Interactive 3D Visualization"
  ],
  status: "Available",
  version: "1.0.0",
  author: "Petrolord",
  license: "Proprietary",
  tags: ["structural", "modeling", "3d", "grid", "volume", "reservoir", "geology"]
};

export default earthModelProMetadata;