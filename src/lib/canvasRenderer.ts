import { Task, Dependency } from '../store/taskReducer';

/**
 * Constants for rendering
 */
const NODE_RADIUS = 20;
const NODE_COLOR = '#1976d2';
const SELECTED_NODE_COLOR = '#ffeb3b';
const EDGE_COLOR = '#888';
const TEXT_COLOR = '#000';

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

/**
 * Draw dependency edges on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 */
function drawEdges(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  dependencies: Dependency[]
): void {
  ctx.strokeStyle = EDGE_COLOR;
  
  dependencies.forEach(dep => {
    const source = tasks.find(t => t.id === dep.from);
    const target = tasks.find(t => t.id === dep.to);
    
    if (!source || !target) return;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });
}

/**
 * Draw task nodes on the canvas
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param selectedTaskId - ID of the selected task
 */
function drawNodes(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  selectedTaskId: string | null
): void {
  tasks.forEach(task => {
    // Draw circle
    ctx.beginPath();
    ctx.arc(task.x, task.y, NODE_RADIUS, 0, 2 * Math.PI);
    
    // Fill with appropriate color
    ctx.fillStyle = task.id === selectedTaskId ? SELECTED_NODE_COLOR : NODE_COLOR;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = TEXT_COLOR;
    ctx.stroke();
    
    // Draw task name
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(task.name, task.x, task.y);
  });
} 