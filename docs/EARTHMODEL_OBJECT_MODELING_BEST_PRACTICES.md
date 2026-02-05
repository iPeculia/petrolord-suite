# Best Practices: Object Modeling

*   **Start Simple**: Begin with a few large objects to define the main reservoir architecture before adding small details.
*   **Use Analogs**: Geometry parameters (width/thickness ratios) are hard to guess. Use global analog databases.
*   **Check Overlap**: Excessive overlap can lead to unrealistic volumes. Use the overlap statistics panel to keep it < 10% unless geologically justified (e.g., amalgamated channels).
*   **Conditioning**: Always check if your objects actually hit the well markers. If not, adjust geometry constraints or relax conditioning strictness.
*   **Visual QC**: Always slice through the 3D model. A model might look good from the outside but have unrealistic internal geometries.