import dagre from '@dagrejs/dagre';

// Layout configuration
const NODE_WIDTH = 100;
const NODE_HEIGHT = 40;

/**
 * Calculate task layout using Dagre for a top-down hierarchy
 * @param {Array} tasks - Array of task objects
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Array} Updated tasks with new positions
 */
export function layoutTasks(tasks, dependencies) {
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

  // Update task positions based on layout
  return tasks.map(task => {
    const nodeWithPos = g.node(task.id);
    return {
      ...task,
      x: nodeWithPos ? nodeWithPos.x : task.x,
      y: nodeWithPos ? nodeWithPos.y : task.y,
    };
  });
} 