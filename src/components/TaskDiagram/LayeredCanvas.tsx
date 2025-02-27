import React, { useRef, useEffect, CSSProperties, MouseEvent, KeyboardEvent, useState } from 'react';
import { Task, Dependency, TaskId } from '../../store/types';
import { drawEdges } from '../../lib/canvas/edgeRenderer';
import { drawNodes } from '../../lib/canvas/nodeRenderer';

interface LayeredCanvasProps {
  width: number;
  height: number;
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: TaskId | null;
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
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
  onMouseDown,
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
  };

  // Default styles for canvas layers
  const canvasStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '1px solid #ccc',
    borderRadius: '4px',
    ...style
  };

  // Style for the interactive layer
  const interactiveStyle: CSSProperties = {
    ...canvasStyle,
    backgroundColor: 'transparent',
    outline: isFocused ? '2px solid #4a90e2' : 'none', // Visual focus indicator
    zIndex: 10 // Top layer to capture interactions
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
        drawEdges(ctx, tasks, dependencies);
      }
    }
  }, [width, height, tasks, dependencies]); // Re-render when tasks or dependencies change

  // Render tasks
  useEffect(() => {
    const canvas = taskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        drawNodes(ctx, tasks, selectedTaskId);
      }
    }
  }, [width, height, tasks, selectedTaskId]); // Re-render when tasks or selection change

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

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
        onKeyDown={handleKeyDown}
        style={interactiveStyle}
        role="img"
        aria-label={title}
        aria-describedby="canvas-description"
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-roledescription="task diagram"
      />
    </div>
  );
};

export default LayeredCanvas; 