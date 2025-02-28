import { Task, Dependency } from '../store/types';

/**
 * Hook for managing task layout and positioning
 */
export function useTaskLayout(
  tasks: Task[],
  dependencies: Dependency[],
  dispatch: React.Dispatch<any>,
  width: number,
  height: number
): void; 