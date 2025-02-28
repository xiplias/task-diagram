import { Task, Dependency } from '../store/types';

/**
 * Hook for persisting tasks and dependencies to storage
 */
export function useTaskStorage(
  tasks: Task[],
  dependencies: Dependency[],
  dispatch: React.Dispatch<any>
): void; 