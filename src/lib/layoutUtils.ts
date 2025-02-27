import dagre from '@dagrejs/dagre';
import { Task, Dependency } from '../store/taskReducer';

// Layout configuration
const NODE_WIDTH = 100;
const NODE_HEIGHT = 40;
const CANVAS_MARGIN = 40; // Margin from the canvas edge

/**
 * Calculate task layout using Dagre for a top-down hierarchy
 * @param tasks - Array of task objects
 * @param dependencies - Array of dependency objects
 * @param canvasWidth - Canvas width (optional)
 * @param canvasHeight - Canvas height (optional)
 * @returns Updated tasks with new positions
 */
export function layoutTasks(
  tasks: Task[], 
  dependencies: Dependency[],
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Task[] {
  // Return early if no tasks
  if (!tasks.length) return tasks;
  
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 });
  g.setDefaultEdgeLabel(() => ({}));

  // Set nodes with fixed dimensions
  tasks.forEach(task => {
    g.setNode(task.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  
  // Set edges based on dependencies
  dependencies.forEach(dep => {
    g.setEdge(dep.from, dep.to);
  });

  // Calculate layout
  dagre.layout(g);

  // First pass: get the bounding box of the graph
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  tasks.forEach(task => {
    const nodeWithPos = g.node(task.id);
    if (nodeWithPos) {
      minX = Math.min(minX, nodeWithPos.x - NODE_WIDTH / 2);
      maxX = Math.max(maxX, nodeWithPos.x + NODE_WIDTH / 2);
      minY = Math.min(minY, nodeWithPos.y - NODE_HEIGHT / 2);
      maxY = Math.max(maxY, nodeWithPos.y + NODE_HEIGHT / 2);
    }
  });
  
  // Calculate the graph dimensions
  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;
  
  // Calculate the horizontal and vertical offsets to center the graph
  const xOffset = (canvasWidth - graphWidth) / 2 - minX;
  const yOffset = (canvasHeight - graphHeight) / 2 - minY;
  
  // Apply margins
  const xOffsetWithMargin = xOffset - CANVAS_MARGIN;
  const yOffsetWithMargin = yOffset - CANVAS_MARGIN;
  
  // Second pass: update task positions with centering offsets
  return tasks.map(task => {
    const nodeWithPos = g.node(task.id);
    
    if (!nodeWithPos) {
      return task;
    }
    
    return {
      ...task,
      x: nodeWithPos.x + xOffsetWithMargin,
      y: nodeWithPos.y + yOffsetWithMargin,
    };
  });
} 