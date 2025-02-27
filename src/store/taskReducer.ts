export interface Task {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Dependency {
  from: string;
  to: string;
}

export interface TaskState {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTask: string | null;
}

type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'ADD_DEPENDENCY'; from: string; to: string }
  | { type: 'SELECT_TASK'; id: string | null }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'SET_DEPENDENCIES'; dependencies: Dependency[] };

// Initial state for the diagram
export const initialState: TaskState = {
  tasks: [],
  dependencies: [],
  selectedTask: null,
};

// Reducer for state management
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.task],
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
    case 'SET_DEPENDENCIES': {
      return { ...state, dependencies: action.dependencies };
    }
    default:
      return state;
  }
} 