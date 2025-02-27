/**
 * Types related to task diagram state management
 */

// Branded types for IDs to prevent mixing up different types of IDs
export type TaskId = string & { readonly __brand: unique symbol };
export type DependencyId = string & { readonly __brand: unique symbol };

export interface Task {
  id: TaskId;
  name: string;
  x: number;
  y: number;
}

export interface Dependency {
  from: TaskId;
  to: TaskId;
}

export interface TaskState {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTask: TaskId | null;
}

// Type guard functions
export function isTaskId(id: string): id is TaskId {
  return typeof id === 'string';
}

export function isDependencyId(id: string): id is DependencyId {
  return typeof id === 'string';
}

// Helper functions for creating typed IDs
export function createTaskId(id: string): TaskId {
  return id as TaskId;
}

export function createDependencyId(id: string): DependencyId {
  return id as DependencyId;
} 