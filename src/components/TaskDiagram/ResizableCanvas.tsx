import React, { useRef, useEffect, CSSProperties, MouseEvent, KeyboardEvent, useState } from 'react';

interface ResizableCanvasProps {
  width: number;
  height: number;
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLCanvasElement>) => void;
  render: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  style?: CSSProperties;
  title?: string;
  description?: string;
}

/**
 * A resizable canvas component that automatically adjusts to its container
 * with added accessibility features
 */
const ResizableCanvas: React.FC<ResizableCanvasProps> = ({ 
  width, 
  height, 
  onMouseDown, 
  onKeyDown,
  render, 
  style = {},
  title = 'Task Diagram',
  description = 'Interactive diagram showing tasks and their dependencies'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Render content to canvas when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        render(ctx, width, height);
      }
    }
  }, [width, height, render]);

  // Default styles
  const defaultStyle: CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'block',
    marginBottom: '16px',
    outline: isFocused ? '2px solid #4a90e2' : 'none', // Visual focus indicator
  };

  // Merge custom styles with defaults
  const mergedStyle = { ...defaultStyle, ...style };

  // Keyboard handling
  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    // Call the provided keyDown handler if it exists
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div role="region" aria-label={title}>
      <div id="canvas-description" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        {description}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onKeyDown={handleKeyDown}
        style={mergedStyle}
        role="img"
        aria-label={title}
        aria-describedby="canvas-description"
        tabIndex={0} // Make canvas focusable
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Additional ARIA attributes
        aria-roledescription="task diagram" 
      />
    </div>
  );
};

export default ResizableCanvas; 