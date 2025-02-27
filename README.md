# Task Diagram

A React application for creating and visualizing task dependency diagrams. This application allows users to create tasks, establish dependencies between them, and automatically layout the tasks in a visually meaningful way.

## Features

- Create and delete tasks
- Establish dependencies between tasks
- Automatic layout of tasks based on dependencies
- Interactive canvas with task selection
- Persistent storage of tasks and dependencies

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

- `src/store/taskReducer.ts`: Reducer for managing task state, including actions for adding/removing tasks and dependencies.

### Utilities

- `src/lib/canvasRenderer.ts`: Handles the rendering of tasks and dependencies on the canvas.
- `src/lib/layoutUtils.ts`: Utility functions for calculating task layouts based on dependencies.

### Types

- `src/types/vitest.d.ts`: Type definitions for Vitest testing library.

### Main Application Files

- `src/App.tsx`: Main application component that renders the TaskDiagram.
- `src/main.tsx`: Entry point for the React application.
- `src/index.ts`: Exports the main components for use in other applications.

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
