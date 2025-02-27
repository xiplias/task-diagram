import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * A resizable canvas component that automatically adjusts to its container
 */
export default function ResizableCanvas({ width, height, onMouseDown, render }) {
  const canvasRef = useRef(null);

  // Render content to canvas when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      render(ctx, width, height);
    }
  }, [width, height, render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      style={{ 
        border: '1px solid #ccc',
        borderRadius: '4px',
        display: 'block',
        marginBottom: '16px' 
      }}
    />
  );
}

ResizableCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onMouseDown: PropTypes.func,
  render: PropTypes.func.isRequired
}; 