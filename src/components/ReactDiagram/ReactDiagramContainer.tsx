import React from 'react';
import { RenderProps } from '../../lib/renderers/IRenderer';
import ReactTask from './ReactTask';
import ReactDependency from './ReactDependency';
import ReactDragIndicator from './ReactDragIndicator';

interface ReactDiagramContainerProps extends RenderProps {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Container component for React-based diagram rendering
 */
const ReactDiagramContainer: React.FC<ReactDiagramContainerProps> = ({
  tasks,
  dependencies,
  selectedTaskId,
  hoveredHandle,
  draggedHandle,
  mousePos,
  width,
  height,
  debugOptions,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  // Set up container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  };
  
  // Optional debug grid component
  const renderDebugGrid = () => {
    if (!debugOptions?.showCoordinateGrid) return null;
    
    const grid = [];
    const gridSize = 20;
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      grid.push(
        <line 
          key={`v-${x}`} 
          x1={x} 
          y1={0} 
          x2={x} 
          y2={height} 
          stroke="#e0e0e0" 
          strokeWidth="1"
        />
      );
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      grid.push(
        <line 
          key={`h-${y}`} 
          x1={0} 
          y1={y} 
          x2={width} 
          y2={y} 
          stroke="#e0e0e0" 
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg 
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} 
        width={width} 
        height={height}
      >
        {grid}
      </svg>
    );
  };
  
  return (
    <div
      className="react-diagram-container"
      style={containerStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Debug grid */}
      {renderDebugGrid()}
      
      {/* Dependencies as SVG lines */}
      {debugOptions?.renderConnections !== false && (
        <svg 
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} 
          width={width} 
          height={height}
        >
          {dependencies.map(dependency => (
            <ReactDependency
              key={`dep-${dependency.from}-${dependency.to}`}
              dependency={dependency}
              tasks={tasks}
            />
          ))}
        </svg>
      )}
      
      {/* Task nodes */}
      {debugOptions?.renderNodes !== false && tasks.map(task => (
        <ReactTask
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          renderHandles={debugOptions?.renderHandles !== false}
          hoveredHandle={hoveredHandle}
        />
      ))}
      
      {/* Drag indicator */}
      {draggedHandle && mousePos && (
        <ReactDragIndicator
          handle={draggedHandle}
          mousePos={mousePos}
          tasks={tasks}
        />
      )}
    </div>
  );
};

export default ReactDiagramContainer; 