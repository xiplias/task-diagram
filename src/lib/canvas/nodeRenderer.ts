import { Task } from '../../store/types';
import { NODE_WIDTH, NODE_HEIGHT, NODE_COLOR, SELECTED_NODE_COLOR, TEXT_COLOR, TEXT_FONT } from './constants';
import { setupTextContext } from './utils';

/**
 * Draw task nodes on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param selectedTaskId - ID of the selected task
 */
export function drawNodes(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  selectedTaskId: string | null
): void {
  tasks.forEach(task => {
    // Draw rectangle
    const x = task.x - NODE_WIDTH / 2;
    const y = task.y - NODE_HEIGHT / 2;
    
    // Fill with appropriate color
    ctx.fillStyle = task.id === selectedTaskId ? SELECTED_NODE_COLOR : NODE_COLOR;
    ctx.fillRect(x, y, NODE_WIDTH, NODE_HEIGHT);
    
    // Draw border
    ctx.strokeStyle = TEXT_COLOR;
    ctx.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);
    
    // Draw task name
    setupTextContext(ctx, TEXT_FONT, TEXT_COLOR);
    ctx.fillText(task.name, task.x, task.y);
  });
} 