import { TaskState } from '../types';
import { DependencyAction } from '../actions';
import { dependencyExists, updateState, addToStateArray } from '../utils';

/**
 * Handles only the dependency-related state changes
 */
export function dependencyReducer(state: TaskState, action: DependencyAction): TaskState {
  switch (action.type) {
    case 'ADD_DEPENDENCY': {
      const { from, to } = action;
      
      // Don't add duplicate dependencies
      if (dependencyExists(state, from, to)) {
        return state;
      }
      
      return addToStateArray(state, 'dependencies', { from, to });
    }
    case 'DELETE_TASK': {
      const taskId = action.id;
      return updateState(state, {
        dependencies: state.dependencies.filter(
          dep => dep.from !== taskId && dep.to !== taskId
        )
      });
    }
    case 'SET_DEPENDENCIES': {
      return updateState(state, { dependencies: action.dependencies });
    }
    default:
      return state;
  }
} 