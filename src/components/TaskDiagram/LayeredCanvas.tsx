import React, { useRef, useEffect, CSSProperties, MouseEvent, KeyboardEvent, useState } from 'react';
import { Task, Dependency, TaskId } from '../../store/types';
import { renderCanvas, DebugOptions } from '../../lib/canvas/canvasRenderer';
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
  
  // Debug settings
  const [debugOptions, setDebugOptions] = useState<DebugOptions>({
    showHitRadius: true,
    showCoordinateGrid: true,
    showDistanceCircles: true,
    useAdjustedCoordinates: true
  });

  // Default styles for the container
  const containerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    marginBottom: '16px',
    marginTop: '24px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px', // Padding matches CONTAINER_PADDING constant
  };

  // Default styles for canvas layers
  const canvasStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '1px solid #ccc',
    borderRadius: '4px',
    // Enforce exact sizing to prevent scaling distortion
    width: `${width}px`,
    height: `${height}px`,
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
  
  // Debug panel style
  const debugPanelStyle: CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  // Render all canvas elements using the unified renderer
  useEffect(() => {
    // Background layer doesn't need to be updated frequently
    const backgroundCanvas = backgroundCanvasRef.current;
    if (backgroundCanvas) {
      const bgCtx = backgroundCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.clearRect(0, 0, width, height);
        // Any static background drawing can go here
      }
    }
    
    // Dependency layer - connections between tasks
    const dependencyCanvas = dependencyCanvasRef.current;
    if (dependencyCanvas) {
      const depCtx = dependencyCanvas.getContext('2d');
      if (depCtx) {
        renderCanvas(
          depCtx, 
          tasks, 
          dependencies, 
          null, // No selected task highlighting on this layer
          null, // No hover effect on this layer
          draggedHandle, 
          mousePos,
          width, 
          height,
          { // Only render connections on this layer
            showHitRadius: false,
            showCoordinateGrid: false,
            showDistanceCircles: false,
            useAdjustedCoordinates: debugOptions.useAdjustedCoordinates
          }
        );
      }
    }
    
    // Task layer - nodes and connection handles
    const taskCanvas = taskCanvasRef.current;
    if (taskCanvas) {
      const taskCtx = taskCanvas.getContext('2d');
      if (taskCtx) {
        renderCanvas(
          taskCtx, 
          tasks, 
          [], // No dependencies on this layer
          selectedTaskId,
          hoveredHandle,
          null, // No dragging visualization on this layer
          null, // No mouse position visualization on this layer
          width, 
          height,
          { // Only debug features for this layer
            showHitRadius: false,
            showCoordinateGrid: false,
            showDistanceCircles: false,
            useAdjustedCoordinates: debugOptions.useAdjustedCoordinates
          }
        );
      }
    }
    
    // Interactive layer - debug visualizations
    const interactiveCanvas = interactiveCanvasRef.current;
    if (interactiveCanvas && mousePos) {
      const interactiveCtx = interactiveCanvas.getContext('2d');
      if (interactiveCtx) {
        interactiveCtx.clearRect(0, 0, width, height);
        
        // Only draw debug info on this layer
        if (debugOptions.showHitRadius || 
            debugOptions.showCoordinateGrid || 
            debugOptions.showDistanceCircles) {
          renderCanvas(
            interactiveCtx, 
            tasks, 
            [], // No dependencies
            null, // No selection
            hoveredHandle,
            draggedHandle,
            mousePos,
            width, 
            height,
            debugOptions
          );
        }
      }
    }
  }, [
    width, 
    height, 
    tasks, 
    dependencies, 
    selectedTaskId, 
    hoveredHandle, 
    draggedHandle, 
    mousePos, 
    debugOptions
  ]);

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Focus handling for keyboard navigation
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  // Toggle debug options
  const toggleDebugOption = (option: keyof DebugOptions) => {
    setDebugOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
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
      
      {/* Debug Controls Panel */}
      <div style={debugPanelStyle}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Debug Controls</h3>
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={debugOptions.showHitRadius} 
              onChange={() => toggleDebugOption('showHitRadius')}
              style={{ marginRight: '6px' }}
            />
            Show Hit Radius
          </label>
        </div>
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={debugOptions.showCoordinateGrid} 
              onChange={() => toggleDebugOption('showCoordinateGrid')}
              style={{ marginRight: '6px' }}
            />
            Show Coordinate Grid
          </label>
        </div>
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={debugOptions.useAdjustedCoordinates} 
              onChange={() => toggleDebugOption('useAdjustedCoordinates')}
              style={{ marginRight: '6px' }}
            />
            Use Adjusted Coordinates
          </label>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={debugOptions.showDistanceCircles} 
              onChange={() => toggleDebugOption('showDistanceCircles')}
              style={{ marginRight: '6px' }}
            />
            Show Distance Circles
          </label>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          HANDLE_RADIUS: 7
        </div>
      </div>
    </div>
  );
};

export default LayeredCanvas; 