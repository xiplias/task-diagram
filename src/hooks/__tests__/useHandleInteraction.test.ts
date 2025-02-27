import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHandleInteraction } from '../useHandleInteraction';
import { HandlePosition } from '../../lib/canvas/handleUtils';
import { createTaskId } from '../../store/types';
import { CONTAINER_PADDING } from '../../lib/canvas/constants';

// Mock the findHandleAtPosition function
vi.mock('../../lib/canvas/handleUtils', () => ({
  findHandleAtPosition: vi.fn(),
  HandlePosition: {
    TOP: 'top',
    BOTTOM: 'bottom'
  },
  ConnectionHandle: vi.fn()
}));

// Import the mocked function
import { findHandleAtPosition } from '../../lib/canvas/handleUtils';

describe('useHandleInteraction Hook', () => {
  const mockDispatch = vi.fn();
  const tasks = [
    { 
      id: createTaskId('task1'), 
      name: 'Task 1', 
      x: 100, 
      y: 100 
    },
    { 
      id: createTaskId('task2'), 
      name: 'Task 2',
      x: 200, 
      y: 200 
    }
  ];

  // Create a mock event
  const createMockMouseEvent = (x: number, y: number) => {
    return {
      clientX: x + CONTAINER_PADDING, // Account for padding
      clientY: y + CONTAINER_PADDING, // Account for padding
      currentTarget: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0
        })
      },
      preventDefault: vi.fn()
    } as unknown as React.MouseEvent<HTMLCanvasElement>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    expect(result.current.hoveredHandle).toBeNull();
    expect(result.current.draggedHandle).toBeNull();
    expect(result.current.mousePos).toBeNull();
  });

  it('should handle mouse down on a connection handle', () => {
    // Mock a connection handle when findHandleAtPosition is called
    const mockHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.TOP,
      x: 100,
      y: 80
    };
    (findHandleAtPosition as any).mockReturnValueOnce(mockHandle);

    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    // Simulate mouse down on a handle
    act(() => {
      result.current.handleMouseDown(createMockMouseEvent(100, 80));
    });

    // Check that the handle is now being dragged
    expect(result.current.draggedHandle).toEqual(mockHandle);
    expect(result.current.mousePos).toEqual({ x: 100, y: 80 });
    
    // Verify dispatch was called to deselect any task
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_TASK', id: null });
  });

  it('should track mouse position during drag', () => {
    // Set up initial drag state
    const mockHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.TOP,
      x: 100,
      y: 80
    };
    (findHandleAtPosition as any).mockReturnValueOnce(mockHandle);

    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    // Start dragging
    act(() => {
      result.current.handleMouseDown(createMockMouseEvent(100, 80));
    });
    
    // Clear the mock so we can test mouseMove separately
    vi.clearAllMocks();
    
    // Move the mouse
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(150, 120));
    });
    
    // Mouse position should be updated
    expect(result.current.mousePos).toEqual({ x: 150, y: 120 });
  });

  it('should create a dependency when dragging from one handle to another', () => {
    // Set up drag source handle
    const sourceHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.BOTTOM,
      x: 100,
      y: 120
    };
    
    // Set up target handle for drop
    const targetHandle = {
      taskId: createTaskId('task2'),
      position: HandlePosition.TOP,
      x: 200,
      y: 180
    };
    
    // Mock the handle finding - first for mouseDown, then for mouseUp
    (findHandleAtPosition as any).mockReturnValueOnce(sourceHandle);
    
    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    // Start the drag
    act(() => {
      result.current.handleMouseDown(createMockMouseEvent(100, 120));
    });
    
    // Now mock the handle find for the drop target
    (findHandleAtPosition as any).mockReturnValueOnce(targetHandle);
    
    // Drop on another handle
    act(() => {
      result.current.handleMouseUp(createMockMouseEvent(200, 180));
    });
    
    // Verify a dependency was created
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'ADD_DEPENDENCY', 
      from: sourceHandle.taskId, 
      to: targetHandle.taskId 
    });
    
    // Drag state should be cleared
    expect(result.current.draggedHandle).toBeNull();
    expect(result.current.mousePos).toBeNull();
  });

  it('should not create a dependency when dropping on the same task', () => {
    // Set up drag source handle
    const sourceHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.TOP,
      x: 100,
      y: 80
    };
    
    // Target handle on the same task (different position)
    const targetHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.BOTTOM,
      x: 100,
      y: 120
    };
    
    // Mock handle finding
    (findHandleAtPosition as any).mockReturnValueOnce(sourceHandle);
    
    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    // Start drag
    act(() => {
      result.current.handleMouseDown(createMockMouseEvent(100, 80));
    });
    
    // Reset dispatch mock after mouse down
    mockDispatch.mockClear();
    
    // Mock the handle find for drop
    (findHandleAtPosition as any).mockReturnValueOnce(targetHandle);
    
    // Drop on same task
    act(() => {
      result.current.handleMouseUp(createMockMouseEvent(100, 120));
    });
    
    // Should not create a dependency for the same task
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ 
      type: 'ADD_DEPENDENCY'
    }));
  });

  it('should not create a dependency when dropping on empty space', () => {
    // Set up drag source handle
    const sourceHandle = {
      taskId: createTaskId('task1'),
      position: HandlePosition.TOP,
      x: 100,
      y: 80
    };
    
    // Mock handle finding for mouseDown
    (findHandleAtPosition as any).mockReturnValueOnce(sourceHandle);
    
    const { result } = renderHook(() => useHandleInteraction(tasks, mockDispatch));
    
    // Start drag
    act(() => {
      result.current.handleMouseDown(createMockMouseEvent(100, 80));
    });
    
    // Reset dispatch mock after mouse down
    mockDispatch.mockClear();
    
    // Mock no handle found when dropping
    (findHandleAtPosition as any).mockReturnValueOnce(null);
    
    // Drop in empty space
    act(() => {
      result.current.handleMouseUp(createMockMouseEvent(300, 300));
    });
    
    // Should not create a dependency
    expect(mockDispatch).not.toHaveBeenCalled();
  });
}); 