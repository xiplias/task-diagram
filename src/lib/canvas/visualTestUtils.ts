import { HANDLE_RADIUS, NODE_WIDTH, NODE_HEIGHT, CONTAINER_PADDING } from './constants';
import { HandlePosition } from './handleUtils';

/**
 * Basic canvas utilities needed by other components.
 * All visual testing specific functions have been removed.
 */

/**
 * Calculate coordinates relative to a canvas element
 * @param clientX Client X coordinate (e.g. from mouse event)
 * @param clientY Client Y coordinate (e.g. from mouse event)
 * @param rect Canvas bounding rectangle
 * @returns Adjusted coordinates relative to the canvas
 */
export function getCanvasCoordinates(clientX: number, clientY: number, rect: DOMRect) {
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

/**
 * Draws a simple grid on a canvas context
 * @param ctx Canvas rendering context
 * @param width Canvas width
 * @param height Canvas height
 * @param gridSize Size of grid cells
 */
export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, gridSize = 50) {
  ctx.save();
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw a handle at the specified position
 * @param ctx Canvas rendering context
 * @param x X coordinate
 * @param y Y coordinate
 */
export function drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#4caf50';
  ctx.fill();
  ctx.strokeStyle = '#388e3c';
  ctx.lineWidth = 2;
  ctx.stroke();
} 