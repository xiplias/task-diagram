import React, { useEffect, useRef } from 'react';
import { createVisualHandleSelectionTest } from '../../lib/canvas/visualTestUtils';
import { HANDLE_RADIUS } from '../../lib/canvas/constants';

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
      <h2>Handle Selection Test - Fixed Mouse Position vs Cursor Issue</h2>
      
      <div style={{ padding: '20px', margin: '20px 0', backgroundColor: '#e3f2fd', borderRadius: '5px', border: '1px solid #90caf9' }}>
        <h3>What was fixed:</h3>
        <p>The application now has separate handling for visual elements and hit detection:</p>
        <ul>
          <li><strong>Visual Handle Size:</strong> {HANDLE_RADIUS}px - What you see on screen</li>
          <li><strong>Hit Detection Area:</strong> {HANDLE_RADIUS + 10}px - A larger invisible area for easier interaction</li>
        </ul>
        <p>This separation solves the problem where the mouse cursor appears to be offset from the actual detection point, making interaction with small UI elements difficult.</p>
      </div>
      
      <p>Move your mouse over the canvas to see the improved hit detection in action. Notice how you can interact with the handles even when the cursor appears to be outside the visual circle.</p>
      
      <div 
        ref={containerRef}
        style={{ 
          margin: '20px 0', 
          padding: '0', 
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center'
        }}
      ></div>
      
      <div className="legend" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4 style={{ marginTop: 0 }}>Visual Guide:</h4>
        <div><span style={{ color: '#4caf50', fontWeight: 'bold' }}>●</span> Green circle: The handle as drawn on the canvas ({HANDLE_RADIUS}px)</div>
        <div><span style={{ color: 'red', fontWeight: 'bold' }}>●</span> Red circle: The expanded hit detection area ({HANDLE_RADIUS + 10}px)</div>
        <div><span style={{ color: 'yellow', fontWeight: 'bold' }}>○</span> Yellow circle: Active hit detection area when mouse is over a handle</div>
        <div><span style={{ color: 'red', fontWeight: 'bold' }}>+</span> Red crosshair: Actual mouse position</div>
        <div><span style={{ color: 'blue', fontWeight: 'bold' }}>○</span> Blue circle: Distance from mouse to handle center</div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff8e1', borderRadius: '5px', border: '1px solid #ffe082' }}>
        <h4 style={{ marginTop: 0 }}>Technical Details:</h4>
        <p>In <code>handleUtils.ts</code>, the <code>isPointInHandle</code> function now uses a larger hit detection radius while maintaining a smaller visual radius. This compensates for the difference between actual mouse position and the visible cursor position.</p>
        <p>Debug tools have been added to help visualize this difference during development.</p>
      </div>
    </div>
  );
};

export default HandleSelectionTest; 