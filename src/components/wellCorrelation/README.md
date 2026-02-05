# Well Correlation Components

This directory contains the React components specific to the Well Correlation Tool.

## Structure

### Layout Components
- **WellCorrelationLayout.jsx**: The master container using `react-resizable-panels`.
- **WellCorrelationHeader.jsx**: Top navigation bar with project actions.
- **LeftSidebar.jsx**: Contains the Well List and Filters.
- **RightSidebar.jsx**: Contains Display Settings and Track Configuration.
- **BottomPanel.jsx**: Activity log and system status.
- **WellCorrelationTabs.jsx**: Main workspace switcher (Correlation vs Data vs Export).

### Workspace Components
- **CorrelationCanvas.jsx**: The main visualization area where logs and correlations are drawn.
- **BackToGeoscienceAnalyticsHub.jsx**: Navigation helper.

### Dialogs
- **NewProjectDialog.jsx**: Form to initialize a project.
- **OpenProjectDialog.jsx**: List view to select existing projects.
- **SaveProjectDialog.jsx**: Confirmation modal for saving.
- **ExportProjectDialog.jsx**: Options for exporting data.

### Buttons/Actions
- **ProjectActions.jsx**: Toolbar group for file operations (New, Open, Save, Export).

## Usage

Most components rely on the `WellCorrelationContext` and should be used within the `WellCorrelationProvider`.