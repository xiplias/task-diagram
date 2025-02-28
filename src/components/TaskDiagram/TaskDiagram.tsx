import React, { useReducer, useCallback, useState } from 'react';
import { rootReducer, initialState } from '../../store/rootReducer';
import { useTaskStorage } from '../../hooks/useTaskStorage';
import { useTaskLayout } from '../../hooks/useTaskLayout';
import { useHandleInteraction } from '../../hooks/useHandleInteraction';
import DiagramRenderer from './DiagramRenderer';
import TaskControls from './TaskControls';
import { createTaskId } from '../../store/types';
import { RendererType } from '../../lib/renderers/RendererFactory';
import { DebugOptions } from '../../lib/renderers/IRenderer';

interface TaskDiagramProps {
  width?: number;
  height?: number;
  initialRendererType?: RendererType;
}

/**
 * TaskDiagram component
 * Displays a diagram with tasks and allows adding dependencies between them
 * Now with support for multiple rendering modes: Canvas, React, WebGL
 */
const TaskDiagram: React.FC<TaskDiagramProps> = ({ 
  width = 800, 
  height = 600,
  initialRendererType = RendererType.Canvas
}) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { tasks, dependencies, selectedTask } = state;
  const [rendererType, setRendererType] = useState<RendererType>(initialRendererType);
  const [debugOptions, setDebugOptions] = useState<Partial<DebugOptions>>({
    showHitRadius: false,
    showCoordinateGrid: false,
    showDistanceCircles: false
  });
  
  // Cast dispatch to any to work around the type issues
  // This is safe because our hooks are designed to work with the correct action types
  const dispatchAny = dispatch as any;
  
  // Use our custom hooks with the cast dispatch
  useTaskStorage(tasks, dependencies, dispatchAny);
  useTaskLayout(tasks, dependencies, dispatchAny, width, height);
  
  // Use the handle interaction hook
  const {
    hoveredHandle,
    draggedHandle,
    mousePos,
    handleMouseDown: originalHandleMouseDown,
    handleMouseMove: originalHandleMouseMove,
    handleMouseUp: originalHandleMouseUp,
    handleMouseLeave: originalHandleMouseLeave
  } = useHandleInteraction(tasks, dispatchAny);
  
  // Create wrapper handlers that can accept both React.MouseEvent<HTMLElement> and MouseEvent
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement> | MouseEvent) => {
    // Cast to the type expected by the original handler
    originalHandleMouseDown(e as any);
  }, [originalHandleMouseDown]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement> | MouseEvent) => {
    // Cast to the type expected by the original handler
    originalHandleMouseMove(e as any);
  }, [originalHandleMouseMove]);
  
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLElement> | MouseEvent) => {
    // Cast to the type expected by the original handler
    originalHandleMouseUp(e as any);
  }, [originalHandleMouseUp]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Cast to the type expected by the original handler - doesn't need the event param
    originalHandleMouseLeave();
  }, [originalHandleMouseLeave]);
  
  // Handle adding a new task
  const handleAddTask = useCallback(() => {
    const idText = `task${tasks.length + 1}`;
    const name = `Task ${tasks.length + 1}`;
    const id = createTaskId(idText);
    dispatch({ type: 'ADD_TASK', task: { id, name, x: Math.round(width / 2), y: Math.round(height / 2) } });
  }, [tasks.length, width, height]);
  
  // Handle renderer type change
  const handleRendererChange = useCallback((newRendererType: RendererType) => {
    setRendererType(newRendererType);
  }, []);
  
  // Toggle debug options
  const handleToggleDebug = useCallback((option: keyof DebugOptions) => {
    setDebugOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  }, []);
  
  return (
    <div className="task-diagram">
      <TaskControls 
        onAddTask={handleAddTask}
        rendererType={rendererType}
        onRendererChange={handleRendererChange}
        debugOptions={debugOptions}
        onToggleDebug={handleToggleDebug}
        selectedTask={selectedTask}
      />
      <DiagramRenderer
        width={width}
        height={height}
        tasks={tasks}
        dependencies={dependencies}
        selectedTaskId={selectedTask}
        hoveredHandle={hoveredHandle}
        draggedHandle={draggedHandle}
        mousePos={mousePos}
        rendererType={rendererType}
        debugOptions={debugOptions}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default TaskDiagram; 