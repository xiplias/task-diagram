// Initial state for the diagram
export const initialState = {
  tasks: [],
  dependencies: [],
  selectedTask: null,
};

// Reducer for state management
export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = {
        id: action.id,
        name: action.name,
        x: action.x,
        y: action.y,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case 'ADD_DEPENDENCY': {
      const { from, to } = action;
      if (state.dependencies.find(dep => dep.from === from && dep.to === to)) {
        return state;
      }
      return {
        ...state,
        dependencies: [...state.dependencies, { from, to }],
      };
    }
    case 'SELECT_TASK': {
      return { ...state, selectedTask: action.id };
    }
    case 'DELETE_TASK': {
      const taskId = action.id;
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== taskId),
        dependencies: state.dependencies.filter(
          dep => dep.from !== taskId && dep.to !== taskId
        ),
        selectedTask: state.selectedTask === taskId ? null : state.selectedTask,
      };
    }
    case 'SET_TASKS': {
      return { ...state, tasks: action.tasks };
    }
    default:
      return state;
  }
} 