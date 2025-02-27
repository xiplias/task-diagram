import React, { useReducer, useCallback } from 'react';
import { renderCanvas } from '../../lib/canvas/canvasRenderer';
import { rootReducer, initialState } from '../../store/rootReducer';
import { useTaskStorage } from '../../hooks/useTaskStorage';
import { useTaskLayout } from '../../hooks/useTaskLayout';
import { useHandleInteraction } from '../../hooks/useHandleInteraction';
import LayeredCanvas from './LayeredCanvas';
import TaskControls from './TaskControls';
import { createTaskId } from '../../store/types';

interface TaskDiagramProps {
  width?: number;
  height?: number;
}

/**
 * TaskDiagram component
 * Displays a canvas with tasks and allows adding dependencies between them
 * Now with connection handles for easier dependency creation
 */
const TaskDiagram: React.FC<TaskDiagramProps> = ({ width = 800, height = 600 }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { tasks, dependencies, selectedTask } = state;
  
  // Use our custom hooks
  useTaskStorage(tasks, dependencies, dispatch);
  useTaskLayout(tasks, dependencies, dispatch, width, height);
  
  // Use the new handle interaction hook
  const {
    hoveredHandle,
    draggedHandle,
    mousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useHandleInteraction(tasks, dispatch);
  
  // Event handlers
  const handleAddTask = useCallback(() => {
    const idText = `task${tasks.length + 1}`;
    const name = `Task ${tasks.length + 1}`;
    const id = createTaskId(idText);
    dispatch({ type: 'ADD_TASK', task: { id, name, x: 100, y: 100 } });
  }, [tasks.length]);
  
  const handleDeleteTask = useCallback(() => {
    if (selectedTask) {
      dispatch({ type: 'DELETE_TASK', id: selectedTask });
    }
  }, [selectedTask]);
  
  return (
    <div className="task-diagram">
      <TaskControls 
        onAddTask={handleAddTask} 
        onDeleteTask={handleDeleteTask}
        selectedTask={selectedTask}
      />
      
      <LayeredCanvas
        width={width}
        height={height}
        tasks={tasks}
        dependencies={dependencies}
        selectedTaskId={selectedTask}
        hoveredHandle={hoveredHandle}
        draggedHandle={draggedHandle}
        mousePos={mousePos}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      <div className="instructions">
        <p>Click and drag from a connection handle (green dot) to another task's handle to create a dependency.</p>
        <p>Select a task and click "Delete Task" to remove it.</p>
      </div>
    </div>
  );
};

export default TaskDiagram; 