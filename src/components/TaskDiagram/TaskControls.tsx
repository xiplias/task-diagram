import React from 'react';

interface TaskControlsProps {
  onAddTask: () => void;
  onDeleteTask: () => void;
  selectedTask: string | null;
}

/**
 * Component for task diagram control buttons
 */
const TaskControls: React.FC<TaskControlsProps> = ({ onAddTask, onDeleteTask, selectedTask }) => {
  return (
    <div className="controls" style={{ marginBottom: '16px' }}>
      <button 
        onClick={onAddTask} 
        style={{ 
          marginRight: '8px',
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Task
      </button>
      
      <button 
        onClick={onDeleteTask} 
        disabled={!selectedTask}
        style={{ 
          padding: '8px 16px',
          backgroundColor: selectedTask ? '#f44336' : '#e0e0e0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: selectedTask ? 'pointer' : 'not-allowed'
        }}
      >
        Delete Task
      </button>
    </div>
  );
};

export default TaskControls; 