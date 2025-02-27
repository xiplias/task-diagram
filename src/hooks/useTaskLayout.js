import { useEffect } from 'react';
import { layoutTasks } from '../lib/layoutUtils';

/**
 * Custom hook to calculate task layout
 * @param {Array} tasks - Array of task objects
 * @param {Array} dependencies - Array of dependency objects
 * @param {Function} dispatch - Reducer dispatch function
 */
export function useTaskLayout(tasks, dependencies, dispatch) {
  useEffect(() => {
    const laidOutTasks = layoutTasks(tasks, dependencies);
    dispatch({ type: 'SET_TASKS', tasks: laidOutTasks });
  }, [tasks.length, dependencies.length, dispatch]);
} 