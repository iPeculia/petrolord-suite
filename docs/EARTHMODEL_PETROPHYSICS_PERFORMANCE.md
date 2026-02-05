# Performance Guide: Petrophysics

*   **Log Sampling**: Standard logs are sampled at 0.15m (0.5ft). A 3000m well has ~20,000 points per curve. This is easily handled by modern browsers.
*   **Rendering**: The Log Viewer uses virtualization (windowing) to only render curves currently in the viewport. This allows viewing very long well sections without lag.
*   **Calculations**: Vectorized operations (SIMD-like in JS via TypedArrays) are used for curve math.