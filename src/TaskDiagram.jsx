import React, { useRef, useReducer, useEffect } from 'react';
import dagre from '@dagrejs/dagre';

// Initial state for the diagram
const initialState = {
  tasks: [],
  dependencies: [],
  selectedTask: null,
};

// Reducer for state management
function reducer(state, action) {
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

// Layout function using Dagre for a top-down hierarchy
function layoutTasks(tasks, dependencies) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 });
  g.setDefaultEdgeLabel(() => ({}));

  // Assume fixed node dimensions for layout
  const nodeWidth = 100;
  const nodeHeight = 40;
  tasks.forEach(task => {
    g.setNode(task.id, { width: nodeWidth, height: nodeHeight });
  });
  dependencies.forEach(dep => {
    g.setEdge(dep.from, dep.to);
  });

  dagre.layout(g);

  return tasks.map(task => {
    const nodeWithPos = g.node(task.id);
    return {
      ...task,
      x: nodeWithPos ? nodeWithPos.x : task.x,
      y: nodeWithPos ? nodeWithPos.y : task.y,
    };
  });
}

const TaskDiagram = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const canvasRef = useRef(null);

  // Auto layout: recalc positions whenever tasks or dependencies change
  useEffect(() => {
    const laidOutTasks = layoutTasks(state.tasks, state.dependencies);
    dispatch({ type: 'SET_TASKS', tasks: laidOutTasks });
  }, [state.tasks.length, state.dependencies.length]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('taskDiagramData', JSON.stringify({
      tasks: state.tasks,
      dependencies: state.dependencies,
    }));
  }, [state.tasks, state.dependencies]);

  // Load persisted state on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskDiagramData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.tasks && data.dependencies) {
          data.tasks.forEach(task => {
            dispatch({ type: 'ADD_TASK', id: task.id, name: task.name, x: task.x, y: task.y });
          });
          data.dependencies.forEach(dep => {
            dispatch({ type: 'ADD_DEPENDENCY', from: dep.from, to: dep.to });
          });
        }
      } catch (error) {
        console.error('Error loading saved data', error);
      }
    }
  }, []);

  // Render the canvas with nodes and edges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = '#888';
    state.dependencies.forEach(dep => {
      const source = state.tasks.find(t => t.id === dep.from);
      const target = state.tasks.find(t => t.id === dep.to);
      if (!source || !target) return;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Draw nodes
    state.tasks.forEach(task => {
      const radius = 20;
      ctx.beginPath();
      ctx.arc(task.x, task.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = task.id === state.selectedTask ? '#ffeb3b' : '#1976d2';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(task.name, task.x, task.y);
    });
  }, [state.tasks, state.dependencies, state.selectedTask]);

  // Handle canvas clicks for node selection and connection creation
  const handleCanvasMouseDown = (event) => {
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const clickedNode = state.tasks.find(task => {
      const dx = task.x - clickX;
      const dy = task.y - clickY;
      const radius = 20;
      return dx * dx + dy * dy <= radius * radius;
    });
    if (clickedNode) {
      if (state.selectedTask && state.selectedTask !== clickedNode.id) {
        dispatch({ type: 'ADD_DEPENDENCY', from: state.selectedTask, to: clickedNode.id });
        dispatch({ type: 'SELECT_TASK', id: null });
      } else {
        dispatch({ type: 'SELECT_TASK', id: clickedNode.id });
      }
    } else {
      dispatch({ type: 'SELECT_TASK', id: null });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => {
          const newId = `Task${state.tasks.length + 1}`;
          dispatch({ type: 'ADD_TASK', id: newId, name: newId, x: 100, y: 100 });
        }}>
          Add Task
        </button>
        {state.selectedTask && (
          <button onClick={() => dispatch({ type: 'DELETE_TASK', id: state.selectedTask })}>
            Delete Selected Task
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #ccc' }}
        onMouseDown={handleCanvasMouseDown}
      />
    </div>
  );
};

export default TaskDiagram;
