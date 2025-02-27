import { useEffect } from 'react';

const STORAGE_KEY = 'taskDiagramData';

/**
 * Custom hook for persisting task data to localStorage
 * @param {Array} tasks - Array of task objects
 * @param {Array} dependencies - Array of dependency objects
 * @param {Function} dispatch - Reducer dispatch function
 */
export function useTaskStorage(tasks, dependencies, dispatch) {
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
      const data = JSON.parse(saved);
      if (!data.tasks || !data.dependencies) return;
      
      // Load tasks
      data.tasks.forEach(task => {
        dispatch({
          type: 'ADD_TASK',
          id: task.id,
          name: task.name,
          x: task.x,
          y: task.y
        });
      });
      
      // Load dependencies
      data.dependencies.forEach(dep => {
        dispatch({
          type: 'ADD_DEPENDENCY',
          from: dep.from,
          to: dep.to
        });
      });
    } catch (error) {
      console.error('Error loading saved task data', error);
    }
  }, [dispatch]);
} 