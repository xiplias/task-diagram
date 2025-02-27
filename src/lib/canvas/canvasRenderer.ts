import { Task, Dependency, TaskId } from '../../store/types';
import { drawEdges } from './edgeRenderer';
import { drawNodes } from './nodeRenderer';
import { ConnectionHandle } from './handleUtils';
import { drawDebugInfo } from './debugUtils';
import { HANDLE_RADIUS } from './constants';

// Create a cache for the canvas rendering
interface RenderingCache {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: TaskId | null;
  hoveredHandle: ConnectionHandle | null;
  draggedHandle: ConnectionHandle | null;
  mousePos: { x: number, y: number } | null;
  width: number;
  height: number;
  timestamp: number;
  debugOptions?: DebugOptions;
}

// Debug visualization options
export interface DebugOptions {
  showHitRadius: boolean;
  showCoordinateGrid: boolean;
  showDistanceCircles: boolean;
  useAdjustedCoordinates: boolean;
}

// Default debug options
const defaultDebugOptions: DebugOptions = {
  showHitRadius: false,
  showCoordinateGrid: false,
  showDistanceCircles: false,
  useAdjustedCoordinates: true
};

let lastRender: RenderingCache | null = null;

/**
 * Checks if current render parameters match the last render
 * @returns true if the render should be skipped, false otherwise
 */
function shouldSkipRender(
  tasks: Task[], 
  dependencies: Dependency[], 
  selectedTaskId: TaskId | null,
  hoveredHandle: ConnectionHandle | null,
  draggedHandle: ConnectionHandle | null,
  mousePos: { x: number, y: number } | null, 
  width: number, 
  height: number
): boolean {
  // If no previous render, always render
  if (!lastRender) return false;

  // If dimensions changed, always render
  if (lastRender.width !== width || lastRender.height !== height) return false;
  
  // If selected task changed, always render
  if (lastRender.selectedTaskId !== selectedTaskId) return false;
  
  // If hovered handle changed, always render
  if ((lastRender.hoveredHandle === null && hoveredHandle !== null) ||
      (lastRender.hoveredHandle !== null && hoveredHandle === null) ||
      (lastRender.hoveredHandle !== null && hoveredHandle !== null && 
       (lastRender.hoveredHandle.taskId !== hoveredHandle.taskId || 
        lastRender.hoveredHandle.position !== hoveredHandle.position))) {
    return false;
  }
  
  // If mouse position changed during dragging, always render
  if (draggedHandle !== null && mousePos !== null && lastRender?.mousePos !== null) {
    if (lastRender.mousePos.x !== mousePos.x || lastRender.mousePos.y !== mousePos.y) {
      return false;
    }
  }
  
  // If drag state changed, always render
  if ((lastRender.draggedHandle === null && draggedHandle !== null) ||
      (lastRender.draggedHandle !== null && draggedHandle === null)) {
    return false;
  }
  
  // Check if tasks or dependencies changed
  const tasksChanged = tasks.length !== lastRender.tasks.length || 
    tasks.some((task, index) => {
      const lastTask = lastRender?.tasks[index];
      return !lastTask || 
        task.id !== lastTask.id || 
        task.name !== lastTask.name || 
        task.x !== lastTask.x || 
        task.y !== lastTask.y;
    });
  
  if (tasksChanged) return false;
  
  const depsChanged = dependencies.length !== lastRender.dependencies.length ||
    dependencies.some((dep, index) => {
      const lastDep = lastRender?.dependencies[index];
      return !lastDep || dep.from !== lastDep.from || dep.to !== lastDep.to;
    });
  
  if (depsChanged) return false;
  
  // Don't skip renders that are more than 1 second apart (ensures visual refresh)
  const now = Date.now();
  if (now - lastRender.timestamp > 1000) return false;
  
  // No changes detected, can skip render
  return true;
}

/**
 * Updates the last render cache
 */
function updateRenderCache(
  tasks: Task[], 
  dependencies: Dependency[], 
  selectedTaskId: TaskId | null,
  hoveredHandle: ConnectionHandle | null,
  draggedHandle: ConnectionHandle | null,
  mousePos: { x: number, y: number } | null, 
  width: number, 
  height: number,
  debugOptions?: Partial<DebugOptions>
): void {
  lastRender = {
    tasks: [...tasks],
    dependencies: [...dependencies],
    selectedTaskId,
    hoveredHandle,
    draggedHandle,
    mousePos: mousePos ? { ...mousePos } : null,
    width,
    height,
    timestamp: Date.now(),
    debugOptions: debugOptions ? { ...defaultDebugOptions, ...debugOptions } : undefined
  };
}

/**
 * Render nodes and edges to a canvas context with memoization
 * @param ctx - Canvas rendering context
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param selectedTaskId - ID of the selected task
 * @param hoveredHandle - Currently hovered connection handle (optional)
 * @param draggedHandle - Currently dragged connection handle (optional)
 * @param mousePos - Current mouse position during dragging (optional)
 * @param width - Canvas width
 * @param height - Canvas height
 * @param debugOptions - Optional debug visualization options
 */
export function renderCanvas(
  ctx: CanvasRenderingContext2D, 
  tasks: Task[], 
  dependencies: Dependency[], 
  selectedTaskId: TaskId | null,
  hoveredHandle: ConnectionHandle | null = null,
  draggedHandle: ConnectionHandle | null = null,
  mousePos: { x: number, y: number } | null = null, 
  width: number, 
  height: number,
  debugOptions: Partial<DebugOptions> = {}
): void {
  // Merge with default debug options
  const debugOpts = { ...defaultDebugOptions, ...debugOptions };
  
  // Skip rendering if nothing has changed
  if (shouldSkipRender(tasks, dependencies, selectedTaskId, hoveredHandle, draggedHandle, mousePos, width, height)) {
    return;
  }
  
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw edges first (so they appear behind nodes)
  drawEdges(ctx, tasks, dependencies, draggedHandle, mousePos);
  
  // Draw nodes
  drawNodes(ctx, tasks, selectedTaskId, hoveredHandle);
  
  // Draw debug visualizations if needed
  if (
    debugOpts.showHitRadius || 
    debugOpts.showCoordinateGrid || 
    debugOpts.showDistanceCircles
  ) {
    drawDebugInfo(
      ctx, 
      mousePos, 
      hoveredHandle, 
      debugOpts.showHitRadius, 
      debugOpts.showCoordinateGrid, 
      debugOpts.showDistanceCircles
    );
  }
  
  // Draw debug panel
  if (debugOpts.showHitRadius || debugOpts.showCoordinateGrid || 
      debugOpts.showDistanceCircles || debugOpts.useAdjustedCoordinates) {
    drawDebugPanel(ctx, mousePos, hoveredHandle, debugOpts);
  }
  
  // Update the render cache
  updateRenderCache(tasks, dependencies, selectedTaskId, hoveredHandle, draggedHandle, mousePos, width, height, debugOpts);
}

/**
 * Draw debug information panel on the canvas
 */
function drawDebugPanel(
  ctx: CanvasRenderingContext2D,
  mousePos: { x: number, y: number } | null,
  hoveredHandle: ConnectionHandle | null,
  debugOptions: DebugOptions
): void {
  if (!mousePos) return;
  
  const { x, y } = mousePos;
  const panel = {
    x: 10,
    y: 10,
    width: 300, // Increased width for more information
    height: hoveredHandle ? 170 : 80, // Increased height further for more detail
    padding: 10
  };
  
  // Draw panel background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(panel.x, panel.y, panel.width, panel.height);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(panel.x, panel.y, panel.width, panel.height);
  
  // Draw panel header
  ctx.fillStyle = 'black';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Debug Information', panel.x + panel.padding, panel.y + panel.padding + 12);
  
  // Draw mouse position (exact coordinates)
  ctx.font = '12px Arial';
  ctx.fillText(`Mouse position: (${x.toFixed(2)}, ${y.toFixed(2)})`, 
               panel.x + panel.padding, 
               panel.y + panel.padding + 30);
  
  // Draw coordinate mode
  ctx.fillText(`Coordinate Mode: ${debugOptions.useAdjustedCoordinates ? 'Adjusted' : 'Raw'}`,
               panel.x + panel.padding,
               panel.y + panel.padding + 45);
               
  // Draw handle information if available
  if (hoveredHandle) {
    ctx.fillText(`Handle: ${hoveredHandle.position} of Task ${hoveredHandle.taskId}`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 65);
    
    // Calculate and display distance
    const dx = hoveredHandle.x - x;
    const dy = hoveredHandle.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    ctx.fillText(`Handle Position: (${hoveredHandle.x.toFixed(2)}, ${hoveredHandle.y.toFixed(2)})`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 80);
                
    ctx.fillText(`Exact distance: ${distance.toFixed(3)} pixels`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 95);
                
    ctx.fillText(`Handle radius: ${HANDLE_RADIUS} pixels`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 110);
                
    // Show whether we're inside the detection area
    const insideArea = distance <= HANDLE_RADIUS;
    ctx.fillStyle = insideArea ? 'green' : 'red';
    ctx.fillText(`Inside Detection Area: ${insideArea ? 'YES' : 'NO'}`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 125);
                
    // Show formula used for calculation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(`Formula: √((${hoveredHandle.x.toFixed(1)} - ${x.toFixed(1)})² + (${hoveredHandle.y.toFixed(1)} - ${y.toFixed(1)})²) = ${distance.toFixed(2)}`, 
                panel.x + panel.padding, 
                panel.y + panel.padding + 145);
  }
} 