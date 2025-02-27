import { useState, useCallback, MouseEvent } from 'react';
import { Task, TaskId } from '../store/types';
import { findHandleAtPosition, ConnectionHandle } from '../lib/canvas/handleUtils';
import { CONTAINER_PADDING } from '../lib/canvas/constants';

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
   * Calculate adjusted mouse coordinates taking into account canvas padding and scaling
   * @param event Mouse event
   * @param rect Canvas bounding rectangle
   * @returns Adjusted X and Y coordinates
   */
  const getAdjustedCoordinates = (event: MouseEvent<HTMLCanvasElement>, rect: DOMRect) => {
    // Get the actual canvas dimensions from the element itself
    const canvas = event.currentTarget;
    
    // Handle case where canvas dimensions might not be available (e.g., in tests)
    let x, y;
    
    // Check if we have access to the canvas dimensions for scaling calculation
    if (canvas.width && canvas.height && rect.width && rect.height) {
      // Calculate the scale factor in case the canvas is being scaled by CSS
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Calculate the coordinates with scaling, then adjust for padding
      x = (event.clientX - rect.left) * scaleX - CONTAINER_PADDING;
      y = (event.clientY - rect.top) * scaleY - CONTAINER_PADDING;
    } else {
      // Fallback for test environments: just use the simple calculation
      x = event.clientX - rect.left - CONTAINER_PADDING;
      y = event.clientY - rect.top - CONTAINER_PADDING;
    }
    
    return { x, y };
  };

  /**
   * Handle mouse down on canvas
   */
  const handleMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const { x: clickX, y: clickY } = getAdjustedCoordinates(event, rect);
    
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
    const { x: mouseX, y: mouseY } = getAdjustedCoordinates(event, rect);
    
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
      const { x: releaseX, y: releaseY } = getAdjustedCoordinates(event, rect);
      
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