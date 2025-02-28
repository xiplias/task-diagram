import React, { useEffect, useRef } from 'react';
import { Task, Dependency, TaskId } from '../../store/types';
import { ConnectionHandle } from '../../lib/canvas/handleUtils';
import { RendererFactory, RendererType } from '../../lib/renderers/RendererFactory';
import { IRenderer, RenderProps, defaultDebugOptions } from '../../lib/renderers/IRenderer';

interface DiagramRendererProps {
  width: number;
  height: number;
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: TaskId | null;
  hoveredHandle: ConnectionHandle | null;
  draggedHandle: ConnectionHandle | null;
  mousePos: { x: number, y: number } | null;
  rendererType?: RendererType;
  debugOptions?: Partial<RenderProps['debugOptions']>;
  onMouseDown: (e: React.MouseEvent<HTMLElement> | MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent<HTMLElement> | MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent<HTMLElement> | MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Component that renders the diagram using the selected renderer
 */
const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  width,
  height,
  tasks,
  dependencies,
  selectedTaskId,
  hoveredHandle,
  draggedHandle,
  mousePos,
  rendererType = RendererType.Canvas, // Default to Canvas renderer
  debugOptions = {},
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<IRenderer | null>(null);
  
  // Create and initialize the renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up previous renderer if it exists
    if (rendererRef.current) {
      rendererRef.current.cleanup();
    }
    
    // Create new renderer
    const renderer = RendererFactory.createRenderer(rendererType);
    rendererRef.current = renderer;
    
    // Initialize renderer
    renderer.initialize(containerRef.current, width, height);
    
    // Clean up on unmount
    return () => {
      if (rendererRef.current) {
        rendererRef.current.cleanup();
        rendererRef.current = null;
      }
    };
  }, [rendererType, width, height]);
  
  // Render the diagram whenever props change
  useEffect(() => {
    if (!rendererRef.current) return;
    
    const renderProps: RenderProps = {
      tasks,
      dependencies,
      selectedTaskId,
      hoveredHandle,
      draggedHandle,
      mousePos,
      width,
      height,
      debugOptions: {
        ...defaultDebugOptions,
        ...debugOptions
      }
    };
    
    rendererRef.current.render(renderProps);
  }, [
    tasks, 
    dependencies, 
    selectedTaskId, 
    hoveredHandle, 
    draggedHandle, 
    mousePos, 
    width, 
    height, 
    debugOptions
  ]);
  
  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (rendererRef.current) {
      rendererRef.current.handleMouseDown(e);
    }
    onMouseDown(e);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (rendererRef.current) {
      rendererRef.current.handleMouseMove(e);
    }
    onMouseMove(e);
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (rendererRef.current) {
      rendererRef.current.handleMouseUp(e);
    }
    onMouseUp(e);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="diagram-renderer"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative',
        margin: '0 auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default DiagramRenderer; 