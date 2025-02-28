import React from 'react';
import { Task } from '../../store/types';
import { ConnectionHandle, HandlePosition } from '../../lib/canvas/handleUtils';
import { HANDLE_RADIUS, NODE_HEIGHT, NODE_WIDTH } from '../../lib/canvas/constants';

interface ReactTaskProps {
  task: Task;
  isSelected: boolean;
  renderHandles: boolean;
  hoveredHandle: ConnectionHandle | null;
}

/**
 * React component to render a task node
 */
const ReactTask: React.FC<ReactTaskProps> = ({
  task,
  isSelected,
  renderHandles,
  hoveredHandle
}) => {
  const { id, name, x, y } = task;
  
  // Task node style
  const taskStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x - NODE_WIDTH / 2}px`,
    top: `${y - NODE_HEIGHT / 2}px`,
    width: `${NODE_WIDTH}px`,
    height: `${NODE_HEIGHT}px`,
    backgroundColor: isSelected ? '#e6f7ff' : '#ffffff',
    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    padding: '8px',
    zIndex: isSelected ? 2 : 1
  };
  
  // Check if a handle is hovered
  const isHandleHovered = (position: HandlePosition): boolean => {
    if (!hoveredHandle) return false;
    return hoveredHandle.taskId === id && hoveredHandle.position === position;
  };
  
  // Top handle style
  const topHandleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '-10px',
    width: `${HANDLE_RADIUS * 2}px`,
    height: `${HANDLE_RADIUS * 2}px`,
    marginLeft: `-${HANDLE_RADIUS}px`,
    backgroundColor: isHandleHovered(HandlePosition.TOP) ? '#faad14' : '#52c41a',
    border: '1px solid #ffffff',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 3
  };
  
  // Bottom handle style
  const bottomHandleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: '-10px',
    width: `${HANDLE_RADIUS * 2}px`,
    height: `${HANDLE_RADIUS * 2}px`,
    marginLeft: `-${HANDLE_RADIUS}px`,
    backgroundColor: isHandleHovered(HandlePosition.BOTTOM) ? '#faad14' : '#52c41a',
    border: '1px solid #ffffff',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 3
  };
  
  return (
    <div className="react-task" style={taskStyle} data-taskid={id}>
      {/* Task content */}
      <div className="task-name" style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {name}
      </div>
      <div className="task-id" style={{ fontSize: '0.8em', color: '#666' }}>
        {id}
      </div>
      
      {/* Connection handles */}
      {renderHandles && (
        <>
          <div 
            className="handle top-handle" 
            style={topHandleStyle} 
            data-handleid={HandlePosition.TOP}
            data-taskid={id}
          />
          <div 
            className="handle bottom-handle" 
            style={bottomHandleStyle} 
            data-handleid={HandlePosition.BOTTOM}
            data-taskid={id}
          />
        </>
      )}
    </div>
  );
};

export default ReactTask; 