import { TaskState } from '../types';
import { TaskAction } from '../actions';

/**
 * Handles only the task-related state changes
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };
    }
    case 'DELETE_TASK': {
      const taskId = action.id;
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== taskId),
        // Removing dependencies is handled by the dependencyReducer
        // but we still need to update the selected task state here
        selectedTask: state.selectedTask === taskId ? null : state.selectedTask,
      };
    }
    case 'SELECT_TASK': {
      return { 
        ...state, 
        selectedTask: action.id 
      };
    }
    case 'SET_TASKS': {
      return { 
        ...state, 
        tasks: action.tasks 
      };
    }
    default:
      return state;
  }
} 