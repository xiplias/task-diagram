import { TaskState } from '../types';
import { TaskAction } from '../actions';
import { updateState, addToStateArray } from '../utils';

/**
 * Handles only the task-related state changes
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK': {
      return addToStateArray(state, 'tasks', action.task);
    }
    case 'DELETE_TASK': {
      const taskId = action.id;
      const selectedTask = state.selectedTask === taskId ? null : state.selectedTask;
      
      return updateState(state, {
        tasks: state.tasks.filter(t => t.id !== taskId),
        selectedTask
      });
    }
    case 'SELECT_TASK': {
      return updateState(state, { selectedTask: action.id });
    }
    case 'SET_TASKS': {
      return updateState(state, { tasks: action.tasks });
    }
    default:
      return state;
  }
} 