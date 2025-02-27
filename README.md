# Task Diagram

A React application for creating and visualizing task dependency diagrams. This application allows users to create tasks, establish dependencies between them, and automatically layout the tasks in a visually meaningful way.

## Features

- Create and delete tasks
- Establish dependencies between tasks
- Automatic layout of tasks based on dependencies
- Interactive canvas with task selection
- Persistent storage of tasks and dependencies
- Enhanced hit detection for improved user interaction

## Project Structure

### Components

- `src/components/TaskDiagram/TaskDiagram.tsx`: Main component that integrates all the task diagram functionality. Manages the task state and coordinates between different hooks.
- `src/components/TaskDiagram/ResizableCanvas.tsx`: A canvas component that automatically resizes and provides a rendering context for the task diagram.
- `src/components/TaskDiagram/TaskControls.tsx`: UI controls for adding and deleting tasks.
- `src/components/TaskDiagram/index.ts`: Export file for the TaskDiagram component.

### Hooks

- `src/hooks/useTaskLayout.ts`: Custom hook that calculates the layout of tasks based on their dependencies using the dagre library.
- `src/hooks/useTaskStorage.ts`: Manages persistence of tasks and dependencies to local storage.
- `src/hooks/useCanvasInteraction.ts`: Handles mouse interactions with the canvas, including task selection and creating dependencies.

### Store

The state management has been refactored and organized for better maintainability:

- `src/store/rootReducer.ts`: Combines multiple reducers into a single root reducer for the application.
- `src/store/actions.ts`: Central file defining action types to ensure consistency throughout the application.
- `src/store/types.ts`: Contains shared type definitions for state management.
- `src/store/utils.ts`: Utility functions used across reducers to simplify state operations and reduce code duplication.
- `src/store/reducers/taskReducer.ts`: Manages task state, including creating and deleting tasks.
- `src/store/reducers/dependencyReducer.ts`: Handles dependency operations between tasks.

### Utilities

- `src/lib/canvasRenderer.ts`: Handles the rendering of tasks and dependencies on the canvas.
- `src/lib/layoutUtils.ts`: Utility functions for calculating task layouts based on dependencies.
- `src/lib/textUtils.ts`: Functions for handling text operations in the canvas context.
- `src/lib/findUtils.ts`: Search utilities for finding specific tasks and dependencies in the state.

### Types

- `src/types/vitest.d.ts`: Type definitions for Vitest testing library.
- `src/types/Task.ts`: Type definitions for tasks and related operations.
- `src/types/Dependency.ts`: Type definitions for dependencies between tasks.

### Main Application Files

- `src/App.tsx`: Main application component that renders the TaskDiagram.
- `src/main.tsx`: Entry point for the React application.
- `src/index.ts`: Exports the main components for use in other applications.
- `src/TaskDiagram.tsx`: Top-level component export for the Task Diagram feature.

## Recent Improvements

### Mouse Pointer vs Cursor Position Fix

We've implemented a solution to address the common issue where the visual cursor position doesn't exactly match the actual mouse pointer coordinates, which can make interacting with small UI elements difficult:

- **Problem**: When interacting with small UI elements like connection handles, the visual cursor position may not exactly match the actual mouse pointer coordinates, making it difficult to click on small targets.

- **Solution**: We've separated the visual rendering radius from the hit detection radius:

  - Visual radius: The size of the handle as drawn on the screen (`HANDLE_RADIUS`)
  - Hit detection radius: A larger area used for detecting mouse interactions (`HANDLE_RADIUS + 10`)

- **Implementation Details**:

  - Modified `isPointInHandle` function to accept an `isHitDetection` parameter
  - Updated rendering code to use the visual radius for drawing
  - Enhanced debug tools to visualize both the visual and hit detection areas

- **Testing**:
  - Added a visual test component (`HandleSelectionTest`) that demonstrates the improved hit detection
  - Created Playwright E2E tests to verify the fix works as expected

To see this in action, click the "Show Selection Test" button in the application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd task-diagram

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Technologies Used

- React
- TypeScript
- Vite
- Dagre (for graph layout)
- Vitest (for testing)
