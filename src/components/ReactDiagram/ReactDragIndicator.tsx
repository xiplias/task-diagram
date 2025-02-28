import React from 'react';
import { Task } from '../../store/types';
import { ConnectionHandle, HandlePosition } from '../../lib/canvas/handleUtils';
import { NODE_HEIGHT } from '../../lib/canvas/constants';

interface ReactDragIndicatorProps {
  handle: ConnectionHandle;
  mousePos: { x: number, y: number };
  tasks: Task[];
}

/**
 * React component to render a drag indicator line when creating connections
 */
const ReactDragIndicator: React.FC<ReactDragIndicatorProps> = ({
  handle,
  mousePos,
  tasks
}) => {
  // Find the source task
  const sourceTask = tasks.find(t => t.id === handle.taskId);
  
  // If the source task doesn't exist, don't render anything
  if (!sourceTask) return null;
  
  // Calculate start point based on the handle position
  let startX = sourceTask.x;
  let startY = sourceTask.y;
  
  // Adjust based on handle position (top or bottom)
  if (handle.position === HandlePosition.TOP) {
    startY -= NODE_HEIGHT / 2;
  } else if (handle.position === HandlePosition.BOTTOM) {
    startY += NODE_HEIGHT / 2;
  }
  
  // End point is the current mouse position
  const endX = mousePos.x;
  const endY = mousePos.y;
  
  // Add a slight curve for better visualization
  // Using a quadratic Bezier curve
  const midY = (startY + endY) / 2;
  
  // Path parameters
  const curveControlX = (startX + endX) / 2;
  const curveControlY = midY + 20; // Add a curve down
  
  // Generate Bezier curve path
  const pathD = `M ${startX} ${startY} Q ${curveControlX} ${curveControlY}, ${endX} ${endY}`;
  
  return (
    <svg 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none',
        zIndex: 5
      }} 
      width="100%" 
      height="100%"
    >
      <path
        d={pathD}
        stroke="#1890ff"
        strokeWidth="2"
        strokeDasharray="5,5"
        fill="none"
      />
      
      {/* Circle at the end point to indicate where the connection will end */}
      <circle
        cx={endX}
        cy={endY}
        r={5}
        fill="#1890ff"
        stroke="#fff"
        strokeWidth="1"
      />
    </svg>
  );
};

export default ReactDragIndicator; 