import { Task, Dependency, TaskId } from '../../store/types';
import { drawEdges } from './edgeRenderer';
import { drawNodes } from './nodeRenderer';
import { ConnectionHandle } from './handleUtils';

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
}

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
  height: number
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
    timestamp: Date.now()
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
  height: number
): void {
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
  
  // Update the render cache
  updateRenderCache(tasks, dependencies, selectedTaskId, hoveredHandle, draggedHandle, mousePos, width, height);
} 