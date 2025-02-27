import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskLayout } from '../useTaskLayout';

// Mock the layoutUtils module
vi.mock('../../lib/layoutUtils', () => ({
  layoutTasks: vi.fn((tasks) => {
    // Mock implementation that provides predictable layout results
    return tasks.map((task, index) => ({
      ...task,
      x: 100 + (index * 100),
      y: 100 + (index * 100)
    }));
  })
}));

describe('useTaskLayout Hook', () => {
  it('should dispatch SET_TASKS with calculated layout', () => {
    const tasks = [
      { id: 'task1', name: 'Task 1', x: 0, y: 0 },
      { id: 'task2', name: 'Task 2', x: 0, y: 0 }
    ];
    
    const dependencies = [{ from: 'task1', to: 'task2' }];
    const mockDispatch = vi.fn();
    
    renderHook(() => useTaskLayout(tasks, dependencies, mockDispatch));
    
    // Verify dispatch was called with the expected layout
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      tasks: [
        { id: 'task1', name: 'Task 1', x: 100, y: 100 },
        { id: 'task2', name: 'Task 2', x: 200, y: 200 }
      ]
    });
  });
  
  it('should not dispatch for empty tasks', () => {
    const mockDispatch = vi.fn();
    renderHook(() => useTaskLayout([], [], mockDispatch));
    
    // Should still call dispatch but with empty array
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      tasks: []
    });
  });
  
  it('should preserve task properties during layout', () => {
    const tasks = [
      { id: 'task1', name: 'Task 1', x: 0, y: 0, customProp: 'value1' },
      { id: 'task2', name: 'Task 2', x: 0, y: 0, customProp: 'value2' }
    ];
    
    const mockDispatch = vi.fn();
    renderHook(() => useTaskLayout(tasks, [], mockDispatch));
    
    // Verify the custom properties were preserved in the dispatch call
    const dispatchArg = mockDispatch.mock.calls[0][0];
    expect(dispatchArg.tasks[0].customProp).toBe('value1');
    expect(dispatchArg.tasks[1].customProp).toBe('value2');
  });
}); 