import { useEffect, Dispatch } from 'react';
import { Task, Dependency } from '../store/taskReducer';

const STORAGE_KEY = 'taskDiagramData';

type TaskAction = 
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'ADD_DEPENDENCY'; from: string; to: string }
  | { type: 'SELECT_TASK'; id: string | null }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'SET_DEPENDENCIES'; dependencies: Dependency[] };

/**
 * Custom hook for persisting task data to localStorage
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param dispatch - Reducer dispatch function
 */
export function useTaskStorage(
  tasks: Task[], 
  dependencies: Dependency[], 
  dispatch: Dispatch<TaskAction>
): void {
  // Save to localStorage whenever tasks or dependencies change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tasks,
      dependencies,
    }));
  }, [tasks, dependencies]);

  // Load from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    try {
      const data = JSON.parse(saved) as { tasks: Task[], dependencies: Dependency[] };
      if (!data.tasks || !data.dependencies) return;
      
      // If there are tasks already loaded, don't load from localStorage
      if (tasks.length > 0) return;
      
      // Load tasks
      if (data.tasks.length > 0) {
        dispatch({ type: 'SET_TASKS', tasks: data.tasks });
      }
      
      // Load dependencies
      if (data.dependencies.length > 0) {
        dispatch({ type: 'SET_DEPENDENCIES', dependencies: data.dependencies });
      }
    } catch (error) {
      console.error('Error loading saved task data', error);
    }
  }, [dispatch, tasks.length]);
} 