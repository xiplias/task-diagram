import { TaskState } from '../types';
import { DependencyAction } from '../actions';

/**
 * Handles only the dependency-related state changes
 */
export function dependencyReducer(state: TaskState, action: DependencyAction): TaskState {
  switch (action.type) {
    case 'ADD_DEPENDENCY': {
      const { from, to } = action;
      
      // Don't add duplicate dependencies
      if (state.dependencies.find(dep => dep.from === from && dep.to === to)) {
        return state;
      }
      
      return {
        ...state,
        dependencies: [...state.dependencies, { from, to }],
      };
    }
    case 'DELETE_TASK': {
      const taskId = action.id;
      return {
        ...state,
        dependencies: state.dependencies.filter(
          dep => dep.from !== taskId && dep.to !== taskId
        ),
      };
    }
    case 'SET_DEPENDENCIES': {
      return {
        ...state,
        dependencies: action.dependencies,
      };
    }
    default:
      return state;
  }
} 