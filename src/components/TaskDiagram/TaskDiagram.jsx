import { useReducer, useCallback } from 'react';
import { renderCanvas } from '../../lib/canvasRenderer';
import { taskReducer } from '../../store/taskReducer';
import { useTaskStorage } from '../../hooks/useTaskStorage';
import { useTaskLayout } from '../../hooks/useTaskLayout';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import ResizableCanvas from './ResizableCanvas';
import TaskControls from './TaskControls';
import PropTypes from 'prop-types';

// Initial state moved to taskReducer.js

/**
 * TaskDiagram component
 * Displays a canvas with tasks and allows adding dependencies between them
 */
export default function TaskDiagram({ width = 800, height = 600 }) {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [], dependencies: [], selectedTask: null });
  const { tasks, dependencies, selectedTask } = state;
  
  // Use our custom hooks
  useTaskStorage(tasks, dependencies, dispatch);
  useTaskLayout(tasks, dependencies, dispatch);
  const handleCanvasMouseDown = useCanvasInteraction(tasks, selectedTask, dispatch);
  
  // Create the render callback for the canvas
  const renderCallback = useCallback((ctx, width, height) => {
    renderCanvas(ctx, tasks, dependencies, selectedTask, width, height);
  }, [tasks, dependencies, selectedTask]);
  
  // Event handlers
  const handleAddTask = useCallback(() => {
    const id = `task${tasks.length + 1}`;
    const name = `Task ${tasks.length + 1}`;
    dispatch({ type: 'ADD_TASK', task: { id, name, x: 100, y: 100 } });
  }, [tasks.length, dispatch]);
  
  const handleDeleteTask = useCallback(() => {
    if (selectedTask) {
      dispatch({ type: 'DELETE_TASK', id: selectedTask });
    }
  }, [selectedTask, dispatch]);
  
  return (
    <div className="task-diagram">
      <TaskControls 
        onAddTask={handleAddTask} 
        onDeleteTask={handleDeleteTask}
        selectedTask={selectedTask}
      />
      
      <ResizableCanvas
        width={width}
        height={height}
        onMouseDown={handleCanvasMouseDown}
        render={renderCallback}
      />
      
      <div className="instructions">
        <p>Click on a task to select it.</p>
        <p>Click on another task while one is selected to create a dependency.</p>
        <p>Select a task and click "Delete Task" to remove it.</p>
      </div>
    </div>
  );
}

TaskDiagram.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}; 