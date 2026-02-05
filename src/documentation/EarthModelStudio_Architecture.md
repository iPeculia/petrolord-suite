# EarthModel Studio - Visualization Architecture

## 1. 3D Window Tab
**File:** `src/components/subsurface-studio/ThreeDWindow.jsx`
**Libraries:** `@react-three/fiber`, `@react-three/drei`, `three`, `d3-delaunay`

### Current Implementation
- **Asset Rendering:**
  - **Wells:** Rendered as 3D cylinders (`<cylinderGeometry>`) with floating text labels.
  - **Trajectories:** Rendered as lines (`<Line>`) using 3D coordinates derived from downloaded station data.
  - **Surfaces:** Generated dynamically from GeoJSON point clouds using `THREE.Delaunay` for triangulation. Supports "Ghost Mode" (transparency) and wireframe edges.
  - **Pointsets:** Rendered as groups of spheres.
- **Scene Controls:**
  - **Clipping:** Global clipping planes (X, Y, Z) implemented via `gl.clippingPlanes`.
  - **Lighting:** Configurable Ambient and Point lights via a settings panel.
  - **Camera:** `OrbitControls` with auto-focus capability (`CameraManager`) that calculates bounding boxes of assets to center the view.
  - **Helpers:** Grid toggle, Background color selector, Orientation Gizmo.

### Missing / Potential Enhancements
- **Seismic Volumes:** No implementation for rendering voxel data or seismic slices/cubes.
- **Advanced Surface Shading:** Currently uses simple `meshStandardMaterial`. Missing attribute mapping (e.g., coloring surface by depth or amplitude).
- **Interactive Picking:** No raycasting implementation for picking points or tops on 3D objects.
- **Fault Sticks:** Faults are rendered as generic surfaces; specific fault stick rendering is missing.

## 2. Map View Tab
**File:** `src/components/subsurface-studio/MapView.jsx`
**Libraries:** `react-leaflet`, `leaflet`, `leaflet-draw`, `leaflet-polylinedecorator`

### Current Implementation
- **Base Maps:** Switchable between OpenStreetMap and Satellite (ArcGIS) layers.
- **Asset Rendering:**
  - **Wells:** Custom `L.divIcon` markers with SVG shapes dynamically colored by well type (Oil=Red, Gas=Green, etc.). Includes permanent tooltips for names.
  - **Surfaces/Interpretations:** Rendered as GeoJSON polygons/lines with conditional styling based on type (Fault, Polygon, Surface).
  - **Images:** `ImageOverlay` support for georeferenced images.
- **Interactivity:**
  - **Drawing:** `EditControl` enabled for creating and editing Polygons, Polylines, and Markers.
  - **Events:** Handlers for creation (`onCreated`) and editing (`onEdited`) to save interpretations back to Supabase.
- **Decorations:** Dynamic Legend generator, North Arrow, Scale Bar, and Lat/Lon Grid overlay.

### Missing / Potential Enhancements
- **Seismic Navigation:** Ability to display and select 2D seismic lines on the map.
- **Contouring:** No client-side contour generation from point data; relies on pre-calculated GeoJSON.
- **CRS Support:** Assumes WGS84 (Lat/Lon). No specialized projection support (e.g., UTM zones) for metric precision.

## 3. Cross Section & Correlation Tab
**File:** `src/components/subsurface-studio/CrossSectionView.jsx`
**Libraries:** `d3`, `react-dnd` (Drag and Drop)

### Current Implementation
- **Track Management:**
  - **Drag & Drop:** Well tracks can be reordered manually using `react-dnd`.
  - **Spacing:** Supports Constant spacing, Relative distance spacing, or Manual positioning.
- **Visualization (D3):**
  - **Logs:** Renders well logs (GR, RHOB, NPHI) as SVG paths using D3 line generators.
  - **Tops:** Renders formation tops as horizontal markers.
  - **Shading:** Basic zone shading (filling area between two curves or correlation lines).
- **Correlation Tools:**
  - **Picking:** Users can click tops to create correlation points across wells.
  - **Drawing:** Renders Spline (`curveCatmullRom`) or Straight lines connecting tops.
  - **Flattening:** "Up/Down" shift buttons per track to flatten on a specific horizon datum manually.
- **Persistance:** Saves correlations as `ss_interpretations` (kind: 'horizon') to Supabase.

### Missing / Potential Enhancements
- **Seismic Backdrop:** Cannot overlay well logs on top of seismic raster data.
- **Lithology Fills:** No pattern filling (e.g., limestone brick patterns) between curves or tops.
- **Ghost Curves:** Ability to overlay a curve from an adjacent well for comparison.
- **Automated Flattening:** One-click "Flatten on Top X" functionality (currently manual shift only).

## Architecture Summary
The architecture separates state management (`StudioContext`) from visualization. 
- **Data Flow:** `activeProject` -> `StudioContext` -> `useStudio` hook -> Components.
- **State:** `allAssets` and `allInterpretations` are the primary data stores, populated from Supabase.
- **Rendering:** 
  - **3D:** Declarative rendering via React-Three-Fiber.
  - **2D:** Imperative/Declarative mix via React-Leaflet and D3.