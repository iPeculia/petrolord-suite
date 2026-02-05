# API Documentation

## WellCorrelationContext

The global state container.

### State Object
| Property | Type | Description |
|----------|------|-------------|
| `currentProject` | Object | The active project metadata. |
| `wells` | Array | List of wells currently added to the correlation session. |
| `availableWells` | Array | List of all wells available in the database (mock). |
| `layoutConfig` | Object | Sizes and visibility of UI panels. |
| `isLoading` | Boolean | Global loading spinner state. |

### Actions
| Action | Payload | Description |
|--------|---------|-------------|
| `createProject` | `{ name, description }` | Initializes a new project. |
| `openProject` | `projectId` | Loads an existing project. |
| `addWell` | `wellObject` | Adds a well to the workspace. |
| `removeWell` | `wellId` | Removes a well from the workspace. |
| `updateLayout` | `configObject` | Updates panel sizes. |

## Utilities

### convertDepth(value, fromUnit, toUnit)
Converts a scalar depth value.
- **Returns**: Number

### getLogColor(curveName)
Returns the standard hex color for a given log curve mnemonic (e.g., 'GR', 'RES').
- **Returns**: String (Hex Color)