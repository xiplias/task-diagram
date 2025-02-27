import { useCallback, Dispatch, MouseEvent } from 'react';
import { Task } from '../store/taskReducer';

// Constants
const NODE_RADIUS = 20;

type TaskAction = 
  | { type: 'SELECT_TASK'; id: string | null }
  | { type: 'ADD_DEPENDENCY'; from: string; to: string };

/**
 * Custom hook for handling canvas interactions
 * @param tasks - Array of task objects
 * @param selectedTask - Currently selected task ID
 * @param dispatch - Reducer dispatch function
 * @returns Mouse down handler for the canvas
 */
export function useCanvasInteraction(
  tasks: Task[], 
  selectedTask: string | null, 
  dispatch: Dispatch<TaskAction>
): (event: MouseEvent<HTMLCanvasElement>) => void {
  return useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Check if a node was clicked
    const clickedNode = findClickedNode(tasks, clickX, clickY);
    
    if (clickedNode) {
      handleNodeClick(clickedNode.id, selectedTask, dispatch);
    } else {
      // Clicked empty space - deselect
      dispatch({ type: 'SELECT_TASK', id: null });
    }
  }, [tasks, selectedTask, dispatch]);
}

/**
 * Find a node at the clicked position
 * @param tasks - Array of task objects
 * @param x - Click X coordinate
 * @param y - Click Y coordinate
 * @returns The clicked task or null
 */
function findClickedNode(tasks: Task[], x: number, y: number): Task | undefined {
  return tasks.find(task => {
    const dx = task.x - x;
    const dy = task.y - y;
    return dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS;
  });
}

/**
 * Handle a node click event
 * @param nodeId - ID of the clicked node
 * @param selectedTask - Currently selected task ID
 * @param dispatch - Reducer dispatch function
 */
function handleNodeClick(
  nodeId: string, 
  selectedTask: string | null, 
  dispatch: Dispatch<TaskAction>
): void {
  if (selectedTask && selectedTask !== nodeId) {
    // Create dependency between selected task and clicked task
    dispatch({ type: 'ADD_DEPENDENCY', from: selectedTask, to: nodeId });
    dispatch({ type: 'SELECT_TASK', id: null }); // Deselect after creating dependency
  } else {
    // Just select/toggle the clicked node
    dispatch({ type: 'SELECT_TASK', id: nodeId });
  }
} 