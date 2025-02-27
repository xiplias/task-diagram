import { CONTAINER_PADDING } from './constants';

/**
 * Unified helper functions for coordinate calculations
 * Used by both the simulation (hit detection) and rendering code
 * to ensure consistent behavior
 */

/**
 * Calculate the actual canvas coordinates from a mouse event
 * Accounts for canvas padding, scaling, and container positioning
 * 
 * @param event Mouse event from React
 * @param rect Canvas bounding rectangle from getBoundingClientRect()
 * @returns Precise X and Y coordinates relative to the canvas content
 */
export function getCanvasCoordinates(
  event: React.MouseEvent<HTMLCanvasElement>, 
  rect: DOMRect
): { x: number, y: number } {
  // Get the actual canvas dimensions from the element
  const canvas = event.currentTarget;
  
  // Get the device pixel ratio to account for high DPI displays
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Handle case where canvas dimensions might not be available (e.g., in tests)
  let x, y;
  
  // Calculate raw position relative to the canvas element's top-left corner
  const rawX = event.clientX - rect.left;
  const rawY = event.clientY - rect.top;
  
  // Check if we have access to the canvas dimensions for scaling calculation
  if (canvas.width && canvas.height && rect.width && rect.height) {
    // Calculate the scale factor between the CSS size and the canvas drawing size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scaling and padding to get the actual canvas coordinates
    x = (rawX * scaleX) - CONTAINER_PADDING;
    y = (rawY * scaleY) - CONTAINER_PADDING;
  } else {
    // Fallback for test environments
    x = rawX - CONTAINER_PADDING;
    y = rawY - CONTAINER_PADDING;
  }
  
  return { x, y };
}

/**
 * Check if a point (x,y) is inside a rectangle
 * 
 * @param rectX Rectangle center X
 * @param rectY Rectangle center Y
 * @param rectWidth Rectangle width
 * @param rectHeight Rectangle height
 * @param pointX Point X to test
 * @param pointY Point Y to test
 * @returns True if the point is inside the rectangle
 */
export function isPointInRect(
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number,
  pointX: number,
  pointY: number
): boolean {
  const halfWidth = rectWidth / 2;
  const halfHeight = rectHeight / 2;
  
  return (
    pointX >= rectX - halfWidth &&
    pointX <= rectX + halfWidth &&
    pointY >= rectY - halfHeight &&
    pointY <= rectY + halfHeight
  );
} 