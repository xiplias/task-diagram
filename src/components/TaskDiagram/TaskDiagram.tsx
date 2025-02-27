import React, { useReducer, useCallback } from 'react';
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
  
  // Cast dispatch to any to work around the type issues
  // This is safe because our hooks are designed to work with the correct action types
  const dispatchAny = dispatch as any;
  
  // Use our custom hooks with the cast dispatch
  useTaskStorage(tasks, dependencies, dispatchAny);
  useTaskLayout(tasks, dependencies, dispatchAny, width, height);
  
  // Use the new handle interaction hook
  const {
    hoveredHandle,
    draggedHandle,
    mousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useHandleInteraction(tasks, dispatchAny);
  
  // Event handlers
  const handleAddTask = useCallback(() => {
    const idText = `task${tasks.length + 1}`;
    const name = `Task ${tasks.length + 1}`;
    const id = createTaskId(idText);
    dispatchAny({ type: 'ADD_TASK', task: { id, name, x: 100, y: 100 } });
  }, [tasks.length, dispatchAny]);
  
  const handleDeleteTask = useCallback(() => {
    if (selectedTask) {
      dispatchAny({ type: 'DELETE_TASK', id: selectedTask });
    }
  }, [selectedTask, dispatchAny]);
  
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