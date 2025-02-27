import { useCallback } from 'react';

// Constants
const NODE_RADIUS = 20;

/**
 * Custom hook for handling canvas interactions
 * @param {Array} tasks - Array of task objects
 * @param {string|null} selectedTask - Currently selected task ID
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Function} - Mouse down handler for the canvas
 */
export function useCanvasInteraction(tasks, selectedTask, dispatch) {
  return useCallback((event) => {
    const rect = event.target.getBoundingClientRect();
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
 * @param {Array} tasks - Array of task objects
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {Object|null} - The clicked task or null
 */
function findClickedNode(tasks, x, y) {
  return tasks.find(task => {
    const dx = task.x - x;
    const dy = task.y - y;
    return dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS;
  });
}

/**
 * Handle a node click event
 * @param {string} nodeId - ID of the clicked node
 * @param {string|null} selectedTask - Currently selected task ID
 * @param {Function} dispatch - Reducer dispatch function
 */
function handleNodeClick(nodeId, selectedTask, dispatch) {
  if (selectedTask && selectedTask !== nodeId) {
    // Create dependency between selected task and clicked task
    dispatch({ type: 'ADD_DEPENDENCY', from: selectedTask, to: nodeId });
    dispatch({ type: 'SELECT_TASK', id: null }); // Deselect after creating dependency
  } else {
    // Just select/toggle the clicked node
    dispatch({ type: 'SELECT_TASK', id: nodeId });
  }
} 