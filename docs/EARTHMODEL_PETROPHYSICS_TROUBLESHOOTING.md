# Troubleshooting: Petrophysics

### Cross-Plot Empty
*   **Cause**: Selected logs do not have overlapping depth intervals.
*   **Fix**: Check the depth range of the input curves in `DataManager`.

### Calculated Sw > 1.0
*   **Cause**: Wrong matrix parameters (e.g., Rho_matrix) or Rw is too high.
*   **Fix**: Re-evaluate the matrix density and water resistivity parameters.

### Synthetic Seismogram Mismatch
*   **Cause**: Checkshot correction missing or poor wavelet extraction.
*   **Fix**: Apply checkshot calibration to the sonic log (Time-Depth relationship) before generating the synthetic.