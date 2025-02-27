import { Task, TaskId } from '../../store/types';
import { NODE_HEIGHT, HANDLE_RADIUS } from './constants';

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
 * This is the SINGLE source of truth for handle positions used by both
 * rendering and hit detection to ensure consistency
 * 
 * @param task The task object
 * @param position The position of the handle (top or bottom)
 * @returns The x, y coordinates of the handle
 */
export function getHandlePosition(task: Task, position: HandlePosition): { x: number, y: number } {
  // Always center horizontally on the task
  // Round to ensure consistency across calculations
  const x = Math.round(task.x * 10) / 10;
  
  let y;
  if (position === HandlePosition.TOP) {
    y = Math.round((task.y - NODE_HEIGHT / 2) * 10) / 10; // Top center
  } else {
    y = Math.round((task.y + NODE_HEIGHT / 2) * 10) / 10; // Bottom center
  }
  
  return { x, y };
}

/**
 * Check if a point is within the radius of a handle
 * Used by both hit detection and rendering visualization
 * 
 * IMPORTANT: This function uses two different radius values:
 * 1. For hit detection (isHitDetection=true): Uses HANDLE_RADIUS + 10px
 *    This creates a larger invisible hit area to make interaction easier
 *    and compensates for differences between mouse position and visual cursor.
 * 2. For visual rendering (isHitDetection=false): Uses exactly HANDLE_RADIUS
 *    This ensures the drawn circle matches the visual design requirements.
 * 
 * This separation solves the problem where the mouse cursor appears to be
 * offset from the actual detection point, making interaction with small
 * UI elements difficult.
 * 
 * @param handleX Handle x coordinate
 * @param handleY Handle y coordinate
 * @param pointX Test point x coordinate
 * @param pointY Test point y coordinate
 * @param isHitDetection Whether this is for hit detection (true) or visual rendering (false)
 * @returns True if the point is within the handle radius
 */
export function isPointInHandle(
  handleX: number, 
  handleY: number, 
  pointX: number, 
  pointY: number,
  isHitDetection: boolean = true
): boolean {
  // Calculate the direct distance between points
  // No rounding at this stage to preserve precision
  const dx = handleX - pointX;
  const dy = handleY - pointY;
  
  // Use the Euclidean distance formula: sqrt(dx² + dy²)
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // For hit detection, use a larger radius to make it easier to click
  // This compensates for differences between mouse position and visual cursor
  const hitRadius = isHitDetection ? HANDLE_RADIUS + 10 : HANDLE_RADIUS;
  
  // Small epsilon (tolerance) value to account for floating point precision issues
  // This is especially important for points exactly at the boundary
  // where floating point errors might cause inconsistent behavior
  const epsilon = isHitDetection ? 0.05 : 0;
  
  // Create detailed debug info for tracing issues
  // Only log on hit detections that are borderline cases
  if (isHitDetection && Math.abs(distance - hitRadius) < 0.5) {
    // Get additional info about the caller
    const stack = new Error().stack || '';
    const caller = stack.split('\n')[2]?.trim() || 'unknown';
    
    // Check if this is from the test harness or main app
    const isTestHarness = caller.includes('visualTestUtils') || caller.includes('HandleSelectionTest');
    
    console.log('====== HANDLE HIT DETECTION DEBUG ======');
    console.log(`Source: ${isTestHarness ? 'TEST HARNESS' : 'MAIN APPLICATION'}`);
    console.log(`Caller: ${caller}`);
    console.log(`Handle position: (${handleX.toFixed(5)}, ${handleY.toFixed(5)})`);
    console.log(`Test point: (${pointX.toFixed(5)}, ${pointY.toFixed(5)})`);
    console.log(`Delta: dx=${dx.toFixed(5)}, dy=${dy.toFixed(5)}`);
    console.log(`Calculated distance: ${distance.toFixed(5)}`);
    console.log(`Hit radius: ${hitRadius} (HANDLE_RADIUS=${HANDLE_RADIUS})`);
    console.log(`Epsilon: ${epsilon}`);
    console.log(`Comparison: ${distance} <= ${hitRadius + epsilon}`);
    console.log(`Result: ${distance <= (hitRadius + epsilon) ? 'INSIDE' : 'OUTSIDE'}`);
    
    // Calculate angle to check if it's in the southeast quadrant
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize angle to 0-360 range
    angle = (angle + 360) % 360;
    
    // Check if it's in the southeast quadrant (0-90 degrees)
    const isInSoutheastQuadrant = (angle >= 0 && angle <= 90);
    
    console.log(`Angle: ${angle.toFixed(2)}° (${isInSoutheastQuadrant ? 'SOUTHEAST QUADRANT' : 'OTHER QUADRANT'})`);
    console.log('=======================================');
  }
  
  // Add epsilon to the hit radius to ensure points very close to the boundary
  // are consistently detected, especially in the southeast quadrant
  // where floating point precision issues have been observed
  return distance <= (hitRadius + epsilon);
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
    if (isPointInHandle(topHandle.x, topHandle.y, x, y, true)) {
      return { 
        taskId: task.id, 
        position: HandlePosition.TOP,
        x: topHandle.x,
        y: topHandle.y
      };
    }
    
    // Check bottom handle
    const bottomHandle = getHandlePosition(task, HandlePosition.BOTTOM);
    if (isPointInHandle(bottomHandle.x, bottomHandle.y, x, y, true)) {
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