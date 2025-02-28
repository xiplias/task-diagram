import React, { useState, useEffect } from 'react';
import TaskDiagram from './components/TaskDiagram';
import { setupDebugMode } from './lib/debugHelpers';
import './App.css';

const App: React.FC = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  
  // Setup debug mode toggling with keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const cleanup = setupDebugMode('d');
    
    // Add note to console about debug mode
    console.info('Debug mode available: Press Ctrl+Shift+D to toggle mouse position debugging');
    
    return cleanup;
  }, []);
  
  return (
    <div className="App">
      <h1>Task Dependency Diagram</h1>
      
      <div className="app-controls" style={{ margin: '20px 0' }}>
        <button
          onClick={() => {
            setDebugEnabled(!debugEnabled);
            // Simulate Ctrl+Shift+D keypress
            if (!debugEnabled) {
              const event = new KeyboardEvent('keydown', {
                key: 'd',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true
              });
              document.dispatchEvent(event);
            } else {
              const event = new KeyboardEvent('keydown', {
                key: 'd',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true
              });
              document.dispatchEvent(event);
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: debugEnabled ? '#f44336' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {debugEnabled ? 'Disable Debug Mode' : 'Enable Debug Mode'}
        </button>
      </div>
      
      <div className="debug-info" style={{ margin: '10px 0', fontSize: '12px', color: '#666' }}>
        <p>Debug mode can be toggled with Ctrl+Shift+D keyboard shortcut</p>
      </div>
      
      <TaskDiagram />
    </div>
  );
};

export default App; 