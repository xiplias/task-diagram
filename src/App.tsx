import React, { useState } from 'react';
import TaskDiagram from './components/TaskDiagram';
import HandleSelectionTest from './components/TaskDiagram/HandleSelectionTest';
import './App.css';

const App: React.FC = () => {
  const [showTest, setShowTest] = useState(false);
  
  return (
    <div className="App">
      <h1>Task Dependency Diagram</h1>
      
      <div className="app-controls" style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setShowTest(!showTest)}
          style={{
            padding: '8px 16px',
            backgroundColor: showTest ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showTest ? 'Hide Selection Test' : 'Show Selection Test'}
        </button>
      </div>
      
      {showTest ? <HandleSelectionTest /> : <TaskDiagram />}
    </div>
  );
};

export default App; 