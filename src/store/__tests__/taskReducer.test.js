import { describe, it, expect } from 'vitest';
import { initialState, taskReducer } from '../taskReducer';

describe('TaskDiagram Reducer', () => {
  it('should return the initial state', () => {
    expect(taskReducer(initialState, {})).toEqual(initialState);
  });
  
  it('should handle ADD_TASK', () => {
    const action = {
      type: 'ADD_TASK',
      id: 'task1',
      name: 'Task 1',
      x: 100,
      y: 200
    };
    
    const newState = taskReducer(initialState, action);
    
    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0]).toEqual({
      id: 'task1',
      name: 'Task 1',
      x: 100,
      y: 200
    });
  });
  
  it('should handle ADD_DEPENDENCY', () => {
    const stateWithTasks = {
      ...initialState,
      tasks: [
        { id: 'task1', name: 'Task 1', x: 100, y: 100 },
        { id: 'task2', name: 'Task 2', x: 200, y: 200 }
      ]
    };
    
    const action = {
      type: 'ADD_DEPENDENCY',
      from: 'task1',
      to: 'task2'
    };
    
    const newState = taskReducer(stateWithTasks, action);
    
    expect(newState.dependencies).toHaveLength(1);
    expect(newState.dependencies[0]).toEqual({
      from: 'task1',
      to: 'task2'
    });
  });
  
  it('should not add duplicate dependencies', () => {
    const stateWithDependency = {
      ...initialState,
      tasks: [
        { id: 'task1', name: 'Task 1', x: 100, y: 100 },
        { id: 'task2', name: 'Task 2', x: 200, y: 200 }
      ],
      dependencies: [
        { from: 'task1', to: 'task2' }
      ]
    };
    
    const action = {
      type: 'ADD_DEPENDENCY',
      from: 'task1',
      to: 'task2'
    };
    
    const newState = taskReducer(stateWithDependency, action);
    
    expect(newState.dependencies).toHaveLength(1);
  });
  
  it('should handle SELECT_TASK', () => {
    const action = {
      type: 'SELECT_TASK',
      id: 'task1'
    };
    
    const newState = taskReducer(initialState, action);
    
    expect(newState.selectedTask).toBe('task1');
  });
  
  it('should handle DELETE_TASK', () => {
    const stateWithTasks = {
      ...initialState,
      tasks: [
        { id: 'task1', name: 'Task 1', x: 100, y: 100 },
        { id: 'task2', name: 'Task 2', x: 200, y: 200 }
      ],
      dependencies: [
        { from: 'task1', to: 'task2' }
      ],
      selectedTask: 'task1'
    };
    
    const action = {
      type: 'DELETE_TASK',
      id: 'task1'
    };
    
    const newState = taskReducer(stateWithTasks, action);
    
    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0].id).toBe('task2');
    expect(newState.dependencies).toHaveLength(0);
    expect(newState.selectedTask).toBeNull();
  });
  
  it('should keep selectedTask when deleting different task', () => {
    const stateWithTasks = {
      ...initialState,
      tasks: [
        { id: 'task1', name: 'Task 1', x: 100, y: 100 },
        { id: 'task2', name: 'Task 2', x: 200, y: 200 }
      ],
      selectedTask: 'task1'
    };
    
    const action = {
      type: 'DELETE_TASK',
      id: 'task2'
    };
    
    const newState = taskReducer(stateWithTasks, action);
    
    expect(newState.selectedTask).toBe('task1');
  });
  
  it('should handle SET_TASKS', () => {
    const newTasks = [
      { id: 'task1', name: 'Task 1', x: 150, y: 150 },
      { id: 'task2', name: 'Task 2', x: 250, y: 250 }
    ];
    
    const action = {
      type: 'SET_TASKS',
      tasks: newTasks
    };
    
    const newState = taskReducer(initialState, action);
    
    expect(newState.tasks).toEqual(newTasks);
  });
}); 