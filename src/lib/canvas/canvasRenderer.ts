import { Task, Dependency } from '../../store/types';
import { drawEdges } from './edgeRenderer';
import { drawNodes } from './nodeRenderer';

/**
 * Render nodes and edges to a canvas context
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param selectedTaskId - ID of the selected task
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function renderCanvas(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  dependencies: Dependency[], 
  selectedTaskId: string | null, 
  width: number, 
  height: number
): void {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw edges first (so they appear behind nodes)
  drawEdges(ctx, tasks, dependencies);
  
  // Draw nodes
  drawNodes(ctx, tasks, selectedTaskId);
} 