# Detailed Workflows: Object Modeling

## Workflow 1: Channel Modeling (Clastic)
1.  **Conceptual Model**: Determine typical channel dimensions from analogs or outcrop data.
2.  **Object Definition**: Create a "Fluvial Channel" object.
3.  **Orientation Analysis**: Use a rose diagram of dipmeter data to determine paleo-flow direction (Azimuth).
4.  **Placement**:
    *   *Soft Data*: Load a seismic RMS amplitude map. Channels often show as high amplitude features.
    *   *Probability*: Use the map as a probability density function (PDF) for stochastic placement.
5.  **Realization**: Run 50 realizations.
6.  **Ranking**: Rank realizations by net-to-gross or connectivity volume.

## Workflow 2: Lobe Modeling (Deepwater)
1.  **Definition**: Create a "Lobe" object with radial geometry.
2.  **Stacking**: Enable "Compensational Stacking". This ensures new lobes prefer topographic lows created by previous lobes.
3.  **Conditioning**: Ensure lobes intersect wells where "Massive Sand" facies are defined.
4.  **QC**: Check the vertical proportion curve (VPC) of the model against the well data.