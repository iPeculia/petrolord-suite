# Troubleshooting: Object Modeling

### Objects not appearing in 3D View
*   **Cause**: Coordinate system mismatch.
*   **Fix**: Check if the project CRS matches the object coordinates. Ensure Z is depth (positive down) or elevation.

### "Conditioning Failed" Error
*   **Cause**: The object geometry is too small to bridge the distance between two conditioning wells, or the wells are too far apart for the specified object size.
*   **Fix**: Increase object length/width or reduce the number of required conditioning wells.

### Slow Performance
*   **Cause**: Too many objects (>10,000) or grid resolution too fine.
*   **Fix**: Use "Level of Detail" rendering or switch to bounding-box view for distant objects.