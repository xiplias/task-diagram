import { Task, Dependency } from './types';

// Task-related actions
export type TaskActionTypes = 
  | 'ADD_TASK'
  | 'DELETE_TASK'
  | 'SELECT_TASK'
  | 'SET_TASKS';

// Dependency-related actions
export type DependencyActionTypes = 
  | 'ADD_DEPENDENCY'
  | 'SET_DEPENDENCIES'
  | 'DELETE_TASK'; // Shared with tasks

// All possible actions
export type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SELECT_TASK'; id: string | null };

export type DependencyAction =
  | { type: 'ADD_DEPENDENCY'; from: string; to: string }
  | { type: 'SET_DEPENDENCIES'; dependencies: Dependency[] }
  | { type: 'DELETE_TASK'; id: string };

// Root action type (union of all actions)
export type RootAction = TaskAction | DependencyAction; 