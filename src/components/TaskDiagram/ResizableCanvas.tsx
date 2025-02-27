import React, { useRef, useEffect, CSSProperties, MouseEvent } from 'react';

interface ResizableCanvasProps {
  width: number;
  height: number;
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  render: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  style?: CSSProperties;
}

/**
 * A resizable canvas component that automatically adjusts to its container
 */
const ResizableCanvas: React.FC<ResizableCanvasProps> = ({ 
  width, 
  height, 
  onMouseDown, 
  render, 
  style = {} 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    marginBottom: '16px'
  };

  // Merge custom styles with defaults
  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      style={mergedStyle}
    />
  );
};

export default ResizableCanvas; 