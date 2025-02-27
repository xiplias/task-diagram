import { useEffect, Dispatch } from 'react';
import { layoutTasks } from '../lib/layoutUtils';
import { Task, Dependency } from '../store/taskReducer';

type TaskAction = { type: 'SET_TASKS'; tasks: Task[] };

/**
 * Custom hook to calculate task layout
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param dispatch - Reducer dispatch function
 */
export function useTaskLayout(
  tasks: Task[], 
  dependencies: Dependency[], 
  dispatch: Dispatch<TaskAction>
): void {
  useEffect(() => {
    const laidOutTasks = layoutTasks(tasks, dependencies);
    dispatch({ type: 'SET_TASKS', tasks: laidOutTasks });
  }, [tasks.length, dependencies.length, dispatch]);
} 