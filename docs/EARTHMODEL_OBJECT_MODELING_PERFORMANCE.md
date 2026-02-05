# Performance Guide: Object Modeling

*   **Browser Limits**: The 3D viewer uses WebGL. Performance depends on the client GPU.
    *   Limit view to < 5,000 objects for smooth 60fps interaction.
    *   Use the "Bounding Box" view mode for massive datasets.
*   **Backend Processing**: Large stochastic simulations (e.g., 100 realizations of 10,000 objects) are processed asynchronously. Do not wait for the HTTP response; monitor the Job ID status.
*   **Database**: Object definitions are light (JSON), but the resulting grid property (voxel array) is heavy. Grid properties are stored in binary blobs (Zarr format recommended for future) rather than individual DB rows.