import React from 'react';
import { TaskId } from '../../store/types';

interface TaskControlsProps {
  onAddTask: () => void;
  onDeleteTask: () => void;
  selectedTask: TaskId | null;
}

/**
 * Component for task control buttons
 */
declare const TaskControls: React.FC<TaskControlsProps>;

export default TaskControls; 