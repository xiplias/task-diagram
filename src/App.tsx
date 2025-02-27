import React from 'react';
import TaskDiagram from './TaskDiagram';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Task Dependency Diagram</h1>
      <TaskDiagram />
    </div>
  );
};

export default App; 