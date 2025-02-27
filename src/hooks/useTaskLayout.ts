import { useEffect, Dispatch } from 'react';
import { layoutTasks } from '../lib/layoutUtils';
import { Task, Dependency } from '../store/taskReducer';

type TaskAction = { type: 'SET_TASKS'; tasks: Task[] };

/**
 * Custom hook to calculate task layout
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param dispatch - Reducer dispatch function
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function useTaskLayout(
  tasks: Task[], 
  dependencies: Dependency[], 
  dispatch: Dispatch<TaskAction>,
  width: number = 800,
  height: number = 600
): void {
  useEffect(() => {
    const laidOutTasks = layoutTasks(tasks, dependencies, width, height);
    dispatch({ type: 'SET_TASKS', tasks: laidOutTasks });
  }, [tasks.length, dependencies.length, width, height, dispatch]);
} 