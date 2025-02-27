import React, { useEffect, useRef } from 'react';
import { createVisualHandleSelectionTest } from '../../lib/canvas/visualTestUtils';

/**
 * This component provides a visual test for verifying that the mouse selection area
 * matches the drawn circle for connection handles.
 */
const HandleSelectionTest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    // Clear any previous test canvas
    containerRef.current.innerHTML = '';
    
    // Create and append the test canvas
    const canvas = createVisualHandleSelectionTest();
    
    // Ensure the canvas is added to the DOM
    containerRef.current.appendChild(canvas);
    
    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="handle-selection-test">
      <h2>Handle Selection Test</h2>
      <p>This test verifies that the mouse selection area matches the drawn circle for connection handles.</p>
      <p>Move your mouse over the canvas to see the hit detection in action.</p>
      <div 
        ref={containerRef}
        style={{ 
          margin: '20px 0', 
          padding: '0', // Remove padding to prevent coordinate offset issues
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center'
        }}
      ></div>
      <div className="legend" style={{ marginTop: '20px' }}>
        <div><span style={{ color: '#4caf50' }}>●</span> Green circle: The handle as drawn on the canvas</div>
        <div><span style={{ color: 'red' }}>●</span> Red dots: Points exactly at HANDLE_RADIUS (should be detected)</div>
        <div><span style={{ color: 'blue' }}>●</span> Blue dots: Points just beyond HANDLE_RADIUS (should NOT be detected)</div>
        <div><span style={{ color: 'yellow' }}>○</span> Yellow circle: Active hit detection area when mouse is over a handle</div>
        <div><span style={{ color: 'red' }}>+</span> Red crosshair: Actual mouse position</div>
        <div><span style={{ color: 'magenta' }}>○</span> Pink circle: HANDLE_RADIUS around mouse position</div>
      </div>
    </div>
  );
};

export default HandleSelectionTest; 