import { useState, useCallback, MouseEvent } from 'react';
import { Task, TaskId } from '../store/types';
import { findHandleAtPosition, ConnectionHandle } from '../lib/canvas/handleUtils';

type TaskAction = 
  | { type: 'ADD_DEPENDENCY'; from: TaskId; to: TaskId }
  | { type: 'SELECT_TASK'; id: TaskId | null };

/**
 * Hook for managing the interaction with connection handles
 * Allows creating connections by dragging from one handle to another
 */
export function useHandleInteraction(
  tasks: Task[],
  dispatch: React.Dispatch<TaskAction>
) {
  // State for tracking interaction
  const [hoveredHandle, setHoveredHandle] = useState<ConnectionHandle | null>(null);
  const [draggedHandle, setDraggedHandle] = useState<ConnectionHandle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

  /**
   * Handle mouse down on canvas
   */
  const handleMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Find if a handle was clicked
    const handle = findHandleAtPosition(tasks, clickX, clickY);
    
    if (handle) {
      // Start dragging from this handle
      setDraggedHandle(handle);
      setMousePos({ x: clickX, y: clickY });
      
      // Clear any selected task
      dispatch({ type: 'SELECT_TASK', id: null });
      
      // Prevent default to avoid conflicts with other handlers
      event.preventDefault();
    }
  }, [tasks, dispatch]);

  /**
   * Handle mouse move on canvas
   */
  const handleMouseMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Update mouse position if dragging
    if (draggedHandle) {
      setMousePos({ x: mouseX, y: mouseY });
    }
    
    // Check if hovering over any handle
    const handle = findHandleAtPosition(tasks, mouseX, mouseY);
    setHoveredHandle(handle);
    
  }, [tasks, draggedHandle]);

  /**
   * Handle mouse up on canvas
   */
  const handleMouseUp = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    // Only process if we were dragging a handle
    if (draggedHandle) {
      const rect = event.currentTarget.getBoundingClientRect();
      const releaseX = event.clientX - rect.left;
      const releaseY = event.clientY - rect.top;
      
      // Check if mouse is over another handle
      const targetHandle = findHandleAtPosition(tasks, releaseX, releaseY);
      
      // If we dropped on a handle and it's not the same as the source
      if (targetHandle && targetHandle.taskId !== draggedHandle.taskId) {
        // Create dependency between the two tasks
        dispatch({ 
          type: 'ADD_DEPENDENCY', 
          from: draggedHandle.taskId, 
          to: targetHandle.taskId 
        });
      }
      
      // Reset drag state
      setDraggedHandle(null);
      setMousePos(null);
    }
  }, [tasks, draggedHandle, dispatch]);

  return {
    hoveredHandle,
    draggedHandle,
    mousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
} 