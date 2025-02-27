import { describe, it, expect } from 'vitest';
import { dependencyExists, updateState, addToStateArray } from '../utils';
import { TaskState, createTaskId } from '../types';

describe('Store Utilities', () => {
  describe('dependencyExists', () => {
    it('should return true when dependency exists', () => {
      const state: TaskState = {
        tasks: [],
        dependencies: [
          { from: createTaskId('task1'), to: createTaskId('task2') },
          { from: createTaskId('task2'), to: createTaskId('task3') }
        ],
        selectedTask: null
      };
      
      expect(dependencyExists(state, createTaskId('task1'), createTaskId('task2'))).toBe(true);
      expect(dependencyExists(state, createTaskId('task2'), createTaskId('task3'))).toBe(true);
    });
    
    it('should return false when dependency does not exist', () => {
      const state: TaskState = {
        tasks: [],
        dependencies: [
          { from: createTaskId('task1'), to: createTaskId('task2') }
        ],
        selectedTask: null
      };
      
      expect(dependencyExists(state, createTaskId('task2'), createTaskId('task1'))).toBe(false); // Reverse direction
      expect(dependencyExists(state, createTaskId('task1'), createTaskId('task3'))).toBe(false); // Non-existent
    });
  });
  
  describe('updateState', () => {
    it('should merge partial updates with existing state', () => {
      const state = {
        count: 1,
        text: 'hello',
        flag: true
      };
      
      const result = updateState(state, { count: 2, text: 'world' });
      
      expect(result).toEqual({
        count: 2,
        text: 'world',
        flag: true
      });
      
      // Original state should be unchanged
      expect(state).toEqual({
        count: 1,
        text: 'hello',
        flag: true
      });
    });
  });
  
  describe('addToStateArray', () => {
    it('should add an item to an array in state', () => {
      const state = {
        items: [1, 2, 3],
        name: 'test'
      };
      
      const result = addToStateArray(state, 'items', 4);
      
      expect(result).toEqual({
        items: [1, 2, 3, 4],
        name: 'test'
      });
      
      // Original state should be unchanged
      expect(state).toEqual({
        items: [1, 2, 3],
        name: 'test'
      });
    });
    
    it('should throw an error if property is not an array', () => {
      const state = {
        count: 5,
        name: 'test'
      };
      
      expect(() => addToStateArray(state, 'count' as any, 1)).toThrow();
    });
  });
}); 