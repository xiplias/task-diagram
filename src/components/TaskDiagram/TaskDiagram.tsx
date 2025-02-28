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
    handleMouseUp: originalHandleMouseUp
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
  
  // Handle renderer type change
  const handleRendererChange = useCallback((type: RendererType) => {
    setRendererType(type);
  }, []);
  
  // Toggle debug options
  const toggleDebugOption = useCallback((option: keyof DebugOptions) => {
    setDebugOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  }, []);
  
  return (
    <div className="task-diagram">
      <div className="renderer-controls" style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Renderer:</label>
        <select 
          value={rendererType} 
          onChange={(e) => handleRendererChange(e.target.value as RendererType)}
          style={{ 
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginRight: '20px'
          }}
        >
          <option value={RendererType.Canvas}>Canvas</option>
          <option value={RendererType.React}>React</option>
          <option value={RendererType.WebGL}>WebGL</option>
        </select>
        
        <label style={{ marginRight: '10px' }}>Debug:</label>
        <label style={{ marginRight: '10px' }}>
          <input 
            type="checkbox" 
            checked={!!debugOptions.showCoordinateGrid} 
            onChange={() => toggleDebugOption('showCoordinateGrid')}
          /> 
          Grid
        </label>
        <label style={{ marginRight: '10px' }}>
          <input 
            type="checkbox" 
            checked={!!debugOptions.showHitRadius} 
            onChange={() => toggleDebugOption('showHitRadius')}
          /> 
          Hit Radius
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={!!debugOptions.showDistanceCircles} 
            onChange={() => toggleDebugOption('showDistanceCircles')}
          /> 
          Distance Circles
        </label>
      </div>
      
      <TaskControls 
        onAddTask={handleAddTask} 
        onDeleteTask={handleDeleteTask}
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
      />
      
      <div className="instructions" style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
        <p>Click and drag from a connection handle (green dot) to another task's handle to create a dependency.</p>
        <p>Select a task and click "Delete Task" to remove it.</p>
        <p>Current renderer: <strong>{rendererType}</strong></p>
      </div>
    </div>
  );
};

export default TaskDiagram; 