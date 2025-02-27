import { Task, Dependency } from '../../store/types';
import { EDGE_COLOR } from './constants';
import { findTaskById } from './utils';

/**
 * Draw dependency edges on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 */
export function drawEdges(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  dependencies: Dependency[]
): void {
  ctx.strokeStyle = EDGE_COLOR;
  
  dependencies.forEach(dep => {
    const source = findTaskById(tasks, dep.from);
    const target = findTaskById(tasks, dep.to);
    
    if (!source || !target) return;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });
} 