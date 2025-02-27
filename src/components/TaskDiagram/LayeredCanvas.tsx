import React, { useRef, useEffect, CSSProperties, MouseEvent, KeyboardEvent, useState } from 'react';
import { Task, Dependency, TaskId } from '../../store/types';
import { drawEdges } from '../../lib/canvas/edgeRenderer';
import { drawNodes } from '../../lib/canvas/nodeRenderer';
import { ConnectionHandle } from '../../lib/canvas/handleUtils';

interface LayeredCanvasProps {
  width: number;
  height: number;
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: TaskId | null;
  // Optional connection handle state for drag-drop connections
  hoveredHandle?: ConnectionHandle | null;
  draggedHandle?: ConnectionHandle | null;
  mousePos?: { x: number, y: number } | null;
  // Mouse event handlers
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLCanvasElement>) => void;
  style?: CSSProperties;
  title?: string;
  description?: string;
}

/**
 * A canvas component that uses multiple layers for better performance
 * - Background layer: static elements that rarely change
 * - Dependency layer: connections between tasks
 * - Task layer: the task nodes themselves
 * - Interactive layer: captures user interactions
 */
const LayeredCanvas: React.FC<LayeredCanvasProps> = ({
  width,
  height,
  tasks,
  dependencies,
  selectedTaskId,
  hoveredHandle = null,
  draggedHandle = null,
  mousePos = null,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onKeyDown,
  style = {},
  title = 'Task Diagram',
  description = 'Interactive diagram showing tasks and their dependencies'
}) => {
  // Create refs for all canvas layers
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const dependencyCanvasRef = useRef<HTMLCanvasElement>(null);
  const taskCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Default styles for the container
  const containerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    marginBottom: '16px',
    marginTop: '24px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  // Default styles for canvas layers
  const canvasStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '20px', // Add internal padding
    ...style
  };

  // Style for the interactive layer
  const interactiveStyle: CSSProperties = {
    ...canvasStyle,
    backgroundColor: 'transparent',
    outline: isFocused ? '2px solid #4a90e2' : 'none', // Visual focus indicator
    zIndex: 10, // Top layer to capture interactions
    cursor: hoveredHandle ? 'pointer' : 'default', // Change cursor when hovering over a handle
  };

  // Render background (static elements)
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        // Add any static background drawing here
      }
    }
  }, [width, height]); // Only re-render when dimensions change

  // Render dependencies
  useEffect(() => {
    const canvas = dependencyCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        drawEdges(ctx, tasks, dependencies, draggedHandle, mousePos);
      }
    }
  }, [width, height, tasks, dependencies, draggedHandle, mousePos]); // Re-render when drag state changes

  // Render tasks
  useEffect(() => {
    const canvas = taskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        drawNodes(ctx, tasks, selectedTaskId, hoveredHandle);
      }
    }
  }, [width, height, tasks, selectedTaskId, hoveredHandle]); // Re-render when hover state changes

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Focus handling for keyboard navigation
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div role="region" aria-label={title} style={containerStyle}>
      <div id="canvas-description" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        {description}
      </div>
      
      {/* Background layer */}
      <canvas
        ref={backgroundCanvasRef}
        width={width}
        height={height}
        style={canvasStyle}
      />
      
      {/* Dependency layer */}
      <canvas
        ref={dependencyCanvasRef}
        width={width}
        height={height}
        style={canvasStyle}
      />
      
      {/* Task layer */}
      <canvas
        ref={taskCanvasRef}
        width={width}
        height={height}
        style={canvasStyle}
      />
      
      {/* Interactive layer (transparent, for capturing events) */}
      <canvas
        ref={interactiveCanvasRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="application"
        aria-describedby="canvas-description"
        style={interactiveStyle}
      />
    </div>
  );
};

export default LayeredCanvas; 