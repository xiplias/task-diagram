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
  HANDLE_HOVER_COLOR,
  HANDLE_STROKE_COLOR
} from './constants';
import { setupTextContext } from './utils';
import { getHandlePosition, HandlePosition, ConnectionHandle } from './handleUtils';

/**
 * Draw a rounded rectangle
 * @param ctx Canvas context
 * @param x X position
 * @param y Y position
 * @param width Width
 * @param height Height
 * @param radius Corner radius
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

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
    
    // Setup shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw rounded rectangle
    drawRoundedRect(ctx, x, y, NODE_WIDTH, NODE_HEIGHT, 6);
    
    // Fill with appropriate color
    ctx.fillStyle = task.id === selectedTaskId ? SELECTED_NODE_COLOR : NODE_COLOR;
    ctx.fill();
    
    // Draw border
    ctx.shadowColor = 'transparent'; // Remove shadow for the stroke
    ctx.strokeStyle = task.id === selectedTaskId ? '#e0a500' : '#0d47a1';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw task name
    setupTextContext(ctx, TEXT_FONT, TEXT_COLOR);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
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
  // Get handle positions using the shared handle position calculator
  const topHandle = getHandlePosition(task, HandlePosition.TOP);
  const isTopHovered = 
    hoveredHandle !== null && 
    hoveredHandle.taskId === task.id && 
    hoveredHandle.position === HandlePosition.TOP;
  
  const bottomHandle = getHandlePosition(task, HandlePosition.BOTTOM);
  const isBottomHovered = 
    hoveredHandle !== null && 
    hoveredHandle.taskId === task.id && 
    hoveredHandle.position === HandlePosition.BOTTOM;
  
  // Use exact coordinates from the getHandlePosition function
  // This ensures perfect alignment with hit detection
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
  // Add a white background circle for better visibility
  ctx.beginPath();
  ctx.arc(x, y, HANDLE_RADIUS + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  // Draw the handle - use EXACTLY the visual HANDLE_RADIUS
  // We explicitly set isHitDetection=false to ensure we use the visual radius
  ctx.beginPath();
  ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = isHovered ? HANDLE_HOVER_COLOR : HANDLE_COLOR;
  ctx.fill();
  ctx.strokeStyle = HANDLE_STROKE_COLOR;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Debug visualization removed
  
  // Add highlight effect if hovered
  if (isHovered) {
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS + 3, 0, Math.PI * 2);
    ctx.strokeStyle = HANDLE_HOVER_COLOR;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
} 