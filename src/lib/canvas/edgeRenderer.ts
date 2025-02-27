import { Task, Dependency } from '../../store/types';
import { EDGE_COLOR } from './constants';
import { findTaskById } from './utils';
import { ConnectionHandle, getHandlePosition, HandlePosition } from './handleUtils';

/**
 * Draw a curved dependency line between two tasks
 * @param ctx Canvas context
 * @param fromX Start X coordinate
 * @param fromY Start Y coordinate
 * @param toX End X coordinate
 * @param toY End Y coordinate
 * @param isDashed Whether to draw a dashed line
 */
function drawCurvedLine(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  isDashed: boolean = false
) {
  // Calculate control points for a bezier curve
  // The control points are positioned vertically between the points
  const distance = Math.abs(toY - fromY);
  const curveDistance = Math.min(distance * 0.5, 50); // Limit the curve distance
  
  // Set up line style
  ctx.lineWidth = 1.5;
  if (isDashed) {
    ctx.setLineDash([5, 3]);
  } else {
    ctx.setLineDash([]);
  }
  
  // Draw the curve
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  
  if (fromY < toY) {
    // From top to bottom - curve downward
    ctx.bezierCurveTo(
      fromX, fromY + curveDistance,
      toX, toY - curveDistance,
      toX, toY
    );
  } else {
    // From bottom to top - curve upward
    ctx.bezierCurveTo(
      fromX, fromY - curveDistance,
      toX, toY + curveDistance,
      toX, toY
    );
  }
  
  ctx.stroke();
  
  // Reset line dash if needed
  if (isDashed) {
    ctx.setLineDash([]);
  }
}

/**
 * Draw dependency edges on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param draggedHandle - Currently dragged connection handle (optional)
 * @param mousePos - Current mouse position during dragging (optional)
 */
export function drawEdges(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  dependencies: Dependency[],
  draggedHandle: ConnectionHandle | null = null,
  mousePos: { x: number, y: number } | null = null
): void {
  ctx.strokeStyle = EDGE_COLOR;
  
  // Draw existing dependency connections
  dependencies.forEach(dep => {
    const source = findTaskById(tasks, dep.from);
    const target = findTaskById(tasks, dep.to);
    
    if (!source || !target) return;
    
    // Get the actual handle positions
    const sourcePos = getHandlePosition(source, HandlePosition.BOTTOM);
    const targetPos = getHandlePosition(target, HandlePosition.TOP);
    
    // Draw curved connection
    drawCurvedLine(ctx, sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
  });
  
  // Draw connection line while dragging
  if (draggedHandle !== null && mousePos !== null) {
    const task = findTaskById(tasks, draggedHandle.taskId);
    if (!task) return;
    
    // Get the position of the dragged handle
    const handlePos = getHandlePosition(task, draggedHandle.position);
    
    // Draw line from handle to mouse position with curve
    drawCurvedLine(ctx, handlePos.x, handlePos.y, mousePos.x, mousePos.y, true);
  }
} 