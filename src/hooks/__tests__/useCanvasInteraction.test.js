import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCanvasInteraction } from '../useCanvasInteraction';

describe('useCanvasInteraction Hook', () => {
  const mockDispatch = vi.fn();
  let mockTasks;
  
  beforeEach(() => {
    // Reset mock functions and data
    vi.clearAllMocks();
    
    mockTasks = [
      { id: 'task1', name: 'Task 1', x: 100, y: 100 },
      { id: 'task2', name: 'Task 2', x: 200, y: 200 }
    ];
  });
  
  it('should handle canvas click that does not hit a task', () => {
    const { result } = renderHook(() => 
      useCanvasInteraction(mockTasks, null, mockDispatch)
    );
    
    // Simulate a click event away from any tasks
    const clickEvent = {
      clientX: 50,
      clientY: 50,
      target: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0
        })
      }
    };
    
    result.current(clickEvent);
    
    // Should deselect any task
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_TASK',
      id: null
    });
  });
  
  it('should select a task when clicking on it', () => {
    const { result } = renderHook(() => 
      useCanvasInteraction(mockTasks, null, mockDispatch)
    );
    
    // Simulate a click event on the first task
    const clickEvent = {
      clientX: 100,
      clientY: 100,
      target: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0
        })
      }
    };
    
    result.current(clickEvent);
    
    // Should select the task
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_TASK',
      id: 'task1'
    });
  });
  
  it('should add dependency when a task is already selected', () => {
    // Start with a selected task
    const selectedTaskId = 'task1';
    
    const { result } = renderHook(() => 
      useCanvasInteraction(mockTasks, selectedTaskId, mockDispatch)
    );
    
    // Simulate clicking on a different task
    const clickEvent = {
      clientX: 200,
      clientY: 200,
      target: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0
        })
      }
    };
    
    result.current(clickEvent);
    
    // Should add a dependency from selected task to the clicked task
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_DEPENDENCY',
      from: 'task1',
      to: 'task2'
    });
    
    // Should also deselect after creating dependency
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_TASK',
      id: null
    });
  });
  
  it('should not add dependency when clicking the same task', () => {
    // Start with a selected task
    const selectedTaskId = 'task1';
    
    const { result } = renderHook(() => 
      useCanvasInteraction(mockTasks, selectedTaskId, mockDispatch)
    );
    
    // Simulate clicking on the same task
    const clickEvent = {
      clientX: 100,
      clientY: 100,
      target: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0
        })
      }
    };
    
    result.current(clickEvent);
    
    // Should not try to add a self-dependency
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({
      type: 'ADD_DEPENDENCY'
    }));
    
    // Should just toggle the selection (select the same task again)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_TASK',
      id: 'task1'
    });
  });
}); 