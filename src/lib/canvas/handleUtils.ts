import { Task, TaskId } from '../../store/types';
import { NODE_WIDTH, NODE_HEIGHT, HANDLE_RADIUS } from './constants';

/**
 * Enum for specifying handle position on a node
 */
export enum HandlePosition {
  TOP = 'top',
  BOTTOM = 'bottom'
}

/**
 * Interface for connection handle details
 */
export interface ConnectionHandle {
  taskId: TaskId;
  position: HandlePosition;
  x: number;
  y: number;
}

/**
 * Calculate the position of a connection handle
 * @param task The task object
 * @param position The position of the handle (top or bottom)
 * @returns The x, y coordinates of the handle
 */
export function getHandlePosition(task: Task, position: HandlePosition): { x: number, y: number } {
  const x = task.x; // Center horizontally
  
  let y;
  if (position === HandlePosition.TOP) {
    y = task.y - NODE_HEIGHT / 2; // Top center
  } else {
    y = task.y + NODE_HEIGHT / 2; // Bottom center
  }
  
  return { x, y };
}

/**
 * Find a connection handle at the given coordinates
 * @param tasks List of tasks
 * @param x Mouse x coordinate
 * @param y Mouse y coordinate
 * @returns The connection handle if found, null otherwise
 */
export function findHandleAtPosition(
  tasks: Task[], 
  x: number, 
  y: number
): ConnectionHandle | null {
  for (const task of tasks) {
    // Check top handle
    const topHandle = getHandlePosition(task, HandlePosition.TOP);
    const dx1 = topHandle.x - x;
    const dy1 = topHandle.y - y;
    if (dx1 * dx1 + dy1 * dy1 <= HANDLE_RADIUS * HANDLE_RADIUS) {
      return { 
        taskId: task.id, 
        position: HandlePosition.TOP,
        x: topHandle.x,
        y: topHandle.y
      };
    }
    
    // Check bottom handle
    const bottomHandle = getHandlePosition(task, HandlePosition.BOTTOM);
    const dx2 = bottomHandle.x - x;
    const dy2 = bottomHandle.y - y;
    if (dx2 * dx2 + dy2 * dy2 <= HANDLE_RADIUS * HANDLE_RADIUS) {
      return { 
        taskId: task.id, 
        position: HandlePosition.BOTTOM,
        x: bottomHandle.x,
        y: bottomHandle.y 
      };
    }
  }
  
  return null;
} 