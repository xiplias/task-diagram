import { Task, TaskId } from '../../store/types';
import { 
  NODE_WIDTH, 
  NODE_HEIGHT, 
  NODE_COLOR, 
  SELECTED_NODE_COLOR, 
  TEXT_COLOR, 
  TEXT_FONT,
  HANDLE_RADIUS,
  HANDLE_COLOR,
  HANDLE_STROKE_COLOR
} from './constants';
import { setupTextContext } from './utils';
import { getHandlePosition, HandlePosition, ConnectionHandle } from './handleUtils';

/**
 * Draw task nodes on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param selectedTaskId - ID of the selected task
 * @param hoveredHandle - Currently hovered connection handle (optional)
 */
export function drawNodes(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  selectedTaskId: TaskId | null,
  hoveredHandle: ConnectionHandle | null = null
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
    
    // Draw connection handles
    drawConnectionHandles(ctx, task, hoveredHandle);
  });
}

/**
 * Draw connection handles for a task node
 * @param ctx - Canvas rendering context
 * @param task - The task to draw handles for
 * @param hoveredHandle - Currently hovered connection handle (optional)
 */
function drawConnectionHandles(
  ctx: CanvasRenderingContext2D,
  task: Task,
  hoveredHandle: ConnectionHandle | null
): void {
  // Draw top handle
  const topHandle = getHandlePosition(task, HandlePosition.TOP);
  const isTopHovered = 
    hoveredHandle !== null && 
    hoveredHandle.taskId === task.id && 
    hoveredHandle.position === HandlePosition.TOP;
  
  // Draw bottom handle
  const bottomHandle = getHandlePosition(task, HandlePosition.BOTTOM);
  const isBottomHovered = 
    hoveredHandle !== null && 
    hoveredHandle.taskId === task.id && 
    hoveredHandle.position === HandlePosition.BOTTOM;
  
  // Draw the handles
  drawHandle(ctx, topHandle.x, topHandle.y, isTopHovered);
  drawHandle(ctx, bottomHandle.x, bottomHandle.y, isBottomHovered);
}

/**
 * Draw a single connection handle
 * @param ctx - Canvas rendering context
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param isHovered - Whether the handle is being hovered
 */
function drawHandle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isHovered: boolean
): void {
  ctx.beginPath();
  ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = HANDLE_COLOR;
  ctx.fill();
  ctx.strokeStyle = HANDLE_STROKE_COLOR;
  ctx.stroke();
  
  // Add highlight effect if hovered
  if (isHovered) {
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS + 2, 0, Math.PI * 2);
    ctx.strokeStyle = HANDLE_COLOR;
    ctx.stroke();
  }
} 