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
  
  // Draw crosshair at mouse position
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
  ctx.lineWidth = 0.5;
  
  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x + 20, y);
  ctx.stroke();
  
  // Vertical line
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
  
  // Draw coordinates text
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
  // Draw the visual radius around the handle (green)
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw the hit detection radius around the handle (red)
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, HANDLE_RADIUS + 10, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw line from handle to mouse
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.moveTo(handle.x, handle.y);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.stroke();
}

/**
 * Draw concentric circles showing distance
 */
function drawDistanceCircles(
  ctx: CanvasRenderingContext2D,
  handle: ConnectionHandle,
  mousePos: { x: number, y: number }
): void {
  // Calculate distance
  const dx = handle.x - mousePos.x;
  const dy = handle.y - mousePos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Draw distance circle
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, distance, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw visual HANDLE_RADIUS circle for comparison
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw hit detection HANDLE_RADIUS circle for comparison
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, HANDLE_RADIUS + 10, 0, Math.PI * 2);
  ctx.stroke();
  
  // Display distance text
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.font = '10px Arial';
  ctx.fillText(`Distance: ${distance.toFixed(1)}`, 
               (handle.x + mousePos.x) / 2, 
               (handle.y + mousePos.y) / 2 - 15);
  
  ctx.fillText(`Visual radius: ${HANDLE_RADIUS}`, 
               (handle.x + mousePos.x) / 2, 
               (handle.y + mousePos.y) / 2);
               
  ctx.fillText(`Hit radius: ${HANDLE_RADIUS + 10}`, 
               (handle.x + mousePos.x) / 2, 
               (handle.y + mousePos.y) / 2 + 15);
} 