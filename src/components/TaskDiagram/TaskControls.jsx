import PropTypes from 'prop-types';

/**
 * Component for task diagram control buttons
 */
export default function TaskControls({ onAddTask, onDeleteTask, selectedTask }) {
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
}

TaskControls.propTypes = {
  onAddTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  selectedTask: PropTypes.string
}; 