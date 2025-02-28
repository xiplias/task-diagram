import React from 'react';
import { Task, Dependency } from '../../store/types';
import { NODE_HEIGHT } from '../../lib/canvas/constants';

interface ReactDependencyProps {
  dependency: Dependency;
  tasks: Task[];
}

/**
 * React component to render a dependency line between tasks
 */
const ReactDependency: React.FC<ReactDependencyProps> = ({
  dependency,
  tasks
}) => {
  // Find the source and target tasks
  const fromTask = tasks.find(t => t.id === dependency.from);
  const toTask = tasks.find(t => t.id === dependency.to);
  
  // If either task doesn't exist, don't render anything
  if (!fromTask || !toTask) return null;
  
  // Calculate start and end points for the line
  // Start from the bottom of the source task
  const startX = fromTask.x;
  const startY = fromTask.y + NODE_HEIGHT / 2;
  
  // End at the top of the target task
  const endX = toTask.x;
  const endY = toTask.y - NODE_HEIGHT / 2;
  
  // Add a slight curve for better visualization
  // Using a quadratic Bezier curve
  const midY = (startY + endY) / 2;
  
  // Path parameters
  const curveControlX = (startX + endX) / 2;
  const curveControlY = midY + 20; // Add a curve down
  
  // Generate Bezier curve path
  const pathD = `M ${startX} ${startY} Q ${curveControlX} ${curveControlY}, ${endX} ${endY}`;
  
  // Arrowhead at the end of the line
  const arrowSize = 6;
  const angle = Math.atan2(endY - curveControlY, endX - curveControlX);
  const arrowPoint1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);
  
  return (
    <g className="react-dependency">
      {/* Bezier curve path */}
      <path
        d={pathD}
        stroke="#666"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Arrowhead */}
      <polygon
        points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
        fill="#666"
        stroke="none"
      />
    </g>
  );
};

export default ReactDependency; 