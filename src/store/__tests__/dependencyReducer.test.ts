import { describe, it, expect } from 'vitest';
import { dependencyReducer } from '../reducers/dependencyReducer';
import { TaskState, createTaskId } from '../types';

describe('Dependency Reducer', () => {
  const initialState: TaskState = {
    tasks: [
      { id: createTaskId('task1'), name: 'Task 1', x: 100, y: 100 },
      { id: createTaskId('task2'), name: 'Task 2', x: 200, y: 200 },
      { id: createTaskId('task3'), name: 'Task 3', x: 300, y: 300 }
    ],
    dependencies: [
      { from: createTaskId('task1'), to: createTaskId('task2') }
    ],
    selectedTask: null
  };

  describe('ADD_DEPENDENCY', () => {
    it('should add a new dependency', () => {
      const action = {
        type: 'ADD_DEPENDENCY' as const,
        from: createTaskId('task2'),
        to: createTaskId('task3')
      };

      const newState = dependencyReducer(initialState, action);

      expect(newState.dependencies).toHaveLength(2);
      expect(newState.dependencies).toContainEqual({ 
        from: createTaskId('task1'), to: createTaskId('task2') 
      });
      expect(newState.dependencies).toContainEqual({ 
        from: createTaskId('task2'), to: createTaskId('task3') 
      });
    });

    it('should not add duplicate dependencies', () => {
      const action = {
        type: 'ADD_DEPENDENCY' as const,
        from: createTaskId('task1'),
        to: createTaskId('task2')
      };

      const newState = dependencyReducer(initialState, action);

      expect(newState).toBe(initialState); // State should not change
      expect(newState.dependencies).toHaveLength(1);
    });
  });

  describe('DELETE_TASK', () => {
    it('should remove all dependencies related to the deleted task', () => {
      // Add another dependency for testing
      const stateWithMoreDeps: TaskState = {
        ...initialState,
        dependencies: [
          ...initialState.dependencies,
          { from: createTaskId('task2'), to: createTaskId('task3') },
          { from: createTaskId('task3'), to: createTaskId('task1') }
        ]
      };

      const action = {
        type: 'DELETE_TASK' as const,
        id: createTaskId('task1')
      };

      const newState = dependencyReducer(stateWithMoreDeps, action);

      expect(newState.dependencies).toHaveLength(1);
      expect(newState.dependencies).toContainEqual({ 
        from: createTaskId('task2'), to: createTaskId('task3') 
      });
      expect(newState.dependencies).not.toContainEqual({ 
        from: createTaskId('task1'), to: createTaskId('task2') 
      });
      expect(newState.dependencies).not.toContainEqual({ 
        from: createTaskId('task3'), to: createTaskId('task1') 
      });
    });
  });

  describe('SET_DEPENDENCIES', () => {
    it('should replace all dependencies', () => {
      const newDependencies = [
        { from: createTaskId('task3'), to: createTaskId('task1') }
      ];

      const action = {
        type: 'SET_DEPENDENCIES' as const,
        dependencies: newDependencies
      };

      const newState = dependencyReducer(initialState, action);

      expect(newState.dependencies).toEqual(newDependencies);
      expect(newState.dependencies).toHaveLength(1);
      expect(newState.dependencies).toContainEqual({ 
        from: createTaskId('task3'), to: createTaskId('task1') 
      });
      expect(newState.dependencies).not.toContainEqual({ 
        from: createTaskId('task1'), to: createTaskId('task2') 
      });
    });
  });
}); 