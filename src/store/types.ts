/**
 * Types related to task diagram state management
 */

export interface Task {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Dependency {
  from: string;
  to: string;
}

export interface TaskState {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTask: string | null;
} 