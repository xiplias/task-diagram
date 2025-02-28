import { ConnectionHandle } from './handleUtils';
import { HANDLE_RADIUS } from './constants';

/**
 * Utility functions for debugging coordinate systems and hit detection
 */

/**
 * Draw debug information on the canvas
 * 
 * @param ctx Canvas context
 * @param mousePos Current mouse position
 * @param hoveredHandle Currently hovered handle (if any)
 * @param showHitRadius Whether to show hit radius visualization
 * @param showCoordinateGrid Whether to show coordinate grid
 * @param showDistanceCircles Whether to show distance circles
 */
export function drawDebugInfo(
  ctx: CanvasRenderingContext2D,
  mousePos: { x: number, y: number } | null,
  hoveredHandle: ConnectionHandle | null,
  showHitRadius: boolean = false,
  showCoordinateGrid: boolean = false,
  showDistanceCircles: boolean = false
): void {
  if (!mousePos) return;
  
  // Save current context state
  ctx.save();
  
  // Draw mouse position
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw coordinate grid if enabled
  if (showCoordinateGrid) {
    drawCoordinateGrid(ctx, mousePos);
  }
  
  // Draw hit radius visualization if enabled
  if (showHitRadius && hoveredHandle) {
    drawHitRadius(ctx, hoveredHandle, mousePos);
  }
  
  // Draw distance circles if enabled
  if (showDistanceCircles && hoveredHandle) {
    drawDistanceCircles(ctx, hoveredHandle, mousePos);
  }
  
  // Restore context state
  ctx.restore();
}

/**
 * Draw coordinate grid centered at mouse position
 */
function drawCoordinateGrid(
  ctx: CanvasRenderingContext2D,
  mousePos: { x: number, y: number }
): void {
  const { x, y } = mousePos;
  
  // Draw coordinates text only, without the crosshair
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.font = '10px Arial';
  ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, x + 10, y - 10);
}

/**
 * Draw the hit radius and actual radius for comparison
 */
function drawHitRadius(
  ctx: CanvasRenderingContext2D,
  handle: ConnectionHandle,
  mousePos: { x: number, y: number }
): void {
  // Empty implementation - visualization removed
  // We're keeping the function to maintain API compatibility
}

/**
 * Draw concentric circles showing distance
 */
function drawDistanceCircles(
  ctx: CanvasRenderingContext2D,
  handle: ConnectionHandle,
  mousePos: { x: number, y: number }
): void {
  // Empty implementation - visualization removed
  // We're keeping the function to maintain API compatibility
} 