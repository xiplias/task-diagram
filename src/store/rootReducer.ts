import { TaskState } from './types';
import { RootAction, TaskAction, DependencyAction } from './actions';
import { taskReducer } from './reducers/taskReducer';
import { dependencyReducer } from './reducers/dependencyReducer';

// Initial state for the diagram
export const initialState: TaskState = {
  tasks: [],
  dependencies: [],
  selectedTask: null,
};

/**
 * Root reducer that combines task and dependency reducers
 * @param state - Current state
 * @param action - Dispatched action
 * @returns Updated state
 */
export function rootReducer(state: TaskState, action: RootAction): TaskState {
  // First apply task-related changes
  const afterTaskReducer = taskReducer(state, action as TaskAction);
  
  // Then apply dependency-related changes
  return dependencyReducer(afterTaskReducer, action as DependencyAction);
} 