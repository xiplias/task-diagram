import { Task, Dependency } from '../../store/types';
import { EDGE_COLOR } from './constants';
import { findTaskById } from './utils';
import { ConnectionHandle, getHandlePosition } from './handleUtils';

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
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });
  
  // Draw connection line while dragging
  if (draggedHandle !== null && mousePos !== null) {
    const task = findTaskById(tasks, draggedHandle.taskId);
    if (!task) return;
    
    // Get the position of the dragged handle
    const handlePos = getHandlePosition(task, draggedHandle.position);
    
    // Draw line from handle to mouse position
    ctx.beginPath();
    ctx.moveTo(handlePos.x, handlePos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    
    // Use dashed line for in-progress connection
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid line
  }
} 