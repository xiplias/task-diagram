// Components
export { default as TaskDiagram } from './components/TaskDiagram';

// Hooks
export { useTaskStorage } from './hooks/useTaskStorage';
export { useTaskLayout } from './hooks/useTaskLayout';
export { useCanvasInteraction } from './hooks/useCanvasInteraction';

// Utilities
export * from './lib/canvasRenderer';
export * from './lib/layoutUtils';

// Store
export { taskReducer, type Task, type Dependency, type TaskState } from './store/taskReducer'; 