import React from 'react';
import TaskDiagram from './TaskDiagram';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Task Dependency Diagram</h1>
      <TaskDiagram />
    </div>
  );
}

export default App;
