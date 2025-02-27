import { HANDLE_RADIUS, NODE_WIDTH, NODE_HEIGHT, CONTAINER_PADDING } from './constants';
import { isPointInHandle, findHandleAtPosition, HandlePosition } from './handleUtils';
import { createTaskId } from '../../store/types';

/**
 * This function creates a canvas element for visual testing of the handle selection area.
 * You can run this in a browser environment to visually verify the handle selection area.
 * 
 * Instructions to use this function:
 * 1. Call this function in a browser context
 * 2. It will create a canvas element and draw a mock task node with handles
 * 3. The green area shows the visual circle that is drawn on the canvas
 * 4. The red translucent circle shows the larger hit detection area
 * 5. The crosshair shows exact mouse position for precision testing
 * 6. Use the debug controls to toggle different visualizations
 * 7. The coordinate display shows if the mouse is within the hit area
 */
export function createVisualHandleSelectionTest() {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.border = '1px solid black';
  canvas.style.backgroundColor = '#f5f5f5';
  
  // Critical: Disable any potential scaling/CSS transforms that might affect coordinate calculation
  // This enforces the canvas to render at its native resolution
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  
  const ctx = canvas.getContext('2d')!;
  const TASK_X = 400;
  const TASK_Y = 300;
  
  // Create a debug state object for interactive controls
  const debugState = {
    showHitRadius: true,
    showVisualRadius: true,
    showGrid: false,
    adjustedCoordinates: true, // Use adjusted coordinates by default
    showDistanceCircles: true
  };
  
  // Draw task node
  function drawTaskNode() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(TASK_X - NODE_WIDTH/2, TASK_Y - NODE_HEIGHT/2, NODE_WIDTH, NODE_HEIGHT);
    
    // Add text to node
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Task Node', TASK_X, TASK_Y);
  }
  
  // Find handle positions
  const topHandlePos = { x: TASK_X, y: TASK_Y - NODE_HEIGHT/2 };
  const bottomHandlePos = { x: TASK_X, y: TASK_Y + NODE_HEIGHT/2 };
  
  // Draw handles
  function drawHandles(mouseX: number, mouseY: number) {
    // Determine if the mouse is over either handle
    const isTopHovered = isPointInHandle(topHandlePos.x, topHandlePos.y, mouseX, mouseY, true);
    const isBottomHovered = isPointInHandle(bottomHandlePos.x, bottomHandlePos.y, mouseX, mouseY, true);
    
    // Draw top handle
    drawHandle(topHandlePos.x, topHandlePos.y, isTopHovered);
    
    // Draw bottom handle
    drawHandle(bottomHandlePos.x, bottomHandlePos.y, isBottomHovered);
  }
  
  // Draw a single handle
  function drawHandle(x: number, y: number, isHovered: boolean) {
    // Add white circle behind for visibility
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS + 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Draw the handle
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = isHovered ? '#81c784' : '#4caf50';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // If debug enabled, show the hit radius
    if (debugState.showHitRadius) {
      ctx.beginPath();
      ctx.arc(x, y, HANDLE_RADIUS + 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // If hovered, add highlight
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x, y, HANDLE_RADIUS + 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#81c784';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  // Draw debug controls
  function drawDebugControls() {
    // Draw controls box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(canvas.width - 250, 10, 240, 160);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(canvas.width - 250, 10, 240, 160);
    
    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Debug Controls', canvas.width - 240, 25);
    
    // Draw checkboxes
    ctx.font = '12px sans-serif';
    
    // Show hit radius checkbox
    ctx.fillRect(canvas.width - 240, 40, 14, 14);
    ctx.clearRect(canvas.width - 239, 41, 12, 12);
    if (debugState.showHitRadius) {
      ctx.fillRect(canvas.width - 236, 44, 6, 6);
    }
    ctx.fillText('Show Hit Radius', canvas.width - 220, 50);
    
    // Show visual radius checkbox
    ctx.fillRect(canvas.width - 240, 60, 14, 14);
    ctx.clearRect(canvas.width - 239, 61, 12, 12);
    if (debugState.showVisualRadius) {
      ctx.fillRect(canvas.width - 236, 64, 6, 6);
    }
    ctx.fillText('Show Visual Radius', canvas.width - 220, 70);
    
    // Show grid checkbox
    ctx.fillRect(canvas.width - 240, 80, 14, 14);
    ctx.clearRect(canvas.width - 239, 81, 12, 12);
    if (debugState.showGrid) {
      ctx.fillRect(canvas.width - 236, 84, 6, 6);
    }
    ctx.fillText('Show Grid', canvas.width - 220, 90);
    
    // Use adjusted coordinates checkbox
    ctx.fillRect(canvas.width - 240, 100, 14, 14);
    ctx.clearRect(canvas.width - 239, 101, 12, 12);
    if (debugState.adjustedCoordinates) {
      ctx.fillRect(canvas.width - 236, 104, 6, 6);
    }
    ctx.fillText('Use Adjusted Coordinates', canvas.width - 220, 110);
    
    // Show distance circles checkbox
    ctx.fillRect(canvas.width - 240, 120, 14, 14);
    ctx.clearRect(canvas.width - 239, 121, 12, 12);
    if (debugState.showDistanceCircles) {
      ctx.fillRect(canvas.width - 236, 124, 6, 6);
    }
    ctx.fillText('Show Distance Circles', canvas.width - 220, 130);
    
    // Draw legend
    ctx.fillText('Green: Visual radius, Red: Hit radius', canvas.width - 240, 150);
  }
  
  // Draw distance circles for clarity
  function drawDistanceCircles(handleX: number, handleY: number, mouseX: number, mouseY: number) {
    // Calculate distance
    const dx = handleX - mouseX;
    const dy = handleY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Draw distance circle
    ctx.beginPath();
    ctx.arc(handleX, handleY, distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Display distance text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Distance: ${distance.toFixed(1)}`, 
                 (handleX + mouseX) / 2, 
                 (handleY + mouseY) / 2 - 10);
  }
  
  // Function to get adjusted coordinates
  function getAdjustedCoordinates(clientX: number, clientY: number, rect: DOMRect) {
    // Calculate the scale factor in case the canvas is being scaled by CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Use the scale factor to adjust the coordinates
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }
  
  // Add click handlers for the debug controls
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    let coords;
    if (debugState.adjustedCoordinates) {
      coords = getAdjustedCoordinates(e.clientX, e.clientY, rect);
    } else {
      coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    const x = coords.x;
    const y = coords.y;
    
    // Check if click is in debug controls area
    if (x >= canvas.width - 250 && x <= canvas.width - 10 && y >= 10 && y <= 170) {
      // Check which control was clicked
      if (x >= canvas.width - 240 && x <= canvas.width - 226) {
        // Checkbox column
        if (y >= 40 && y <= 54) {
          debugState.showHitRadius = !debugState.showHitRadius;
        } else if (y >= 60 && y <= 74) {
          debugState.showVisualRadius = !debugState.showVisualRadius;
        } else if (y >= 80 && y <= 94) {
          debugState.showGrid = !debugState.showGrid;
        } else if (y >= 100 && y <= 114) {
          debugState.adjustedCoordinates = !debugState.adjustedCoordinates;
        } else if (y >= 120 && y <= 134) {
          debugState.showDistanceCircles = !debugState.showDistanceCircles;
        }
      }
      
      // Re-render with updated debug state
      const rect = canvas.getBoundingClientRect();
      const coords = getAdjustedCoordinates(e.clientX, e.clientY, rect);
      renderFrame(coords.x, coords.y);
    }
  });
  
  // Handle mouse movement to show hit detection
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let coords;
    if (debugState.adjustedCoordinates) {
      coords = getAdjustedCoordinates(e.clientX, e.clientY, rect);
    } else {
      coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    renderFrame(coords.x, coords.y);
  });
  
  // Render a frame with the current mouse position
  function renderFrame(x: number, y: number) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (debugState.showGrid) {
      drawGrid();
    }
    
    // Draw task node
    drawTaskNode();
    
    // Draw handles
    drawHandles(x, y);
    
    // Check for hovering over handles
    // Create a simulated task for testing
    const task = {
      id: createTaskId('test'),
      name: 'Test Task',
      x: TASK_X,
      y: TASK_Y
    };
    
    const tasks = [task];
    const handle = findHandleAtPosition(tasks, x, y);
    
    // Show distance circles if enabled
    if (debugState.showDistanceCircles) {
      drawDistanceCircles(topHandlePos.x, topHandlePos.y, x, y);
      drawDistanceCircles(bottomHandlePos.x, bottomHandlePos.y, x, y);
    }
    
    // Draw the actual mouse position as a crosshair for precise positioning
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
    
    // Draw hit detection visualization
    if (handle) {
      // Draw a yellow box to show the active hit area
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, HANDLE_RADIUS + 10, 0, Math.PI * 2);
      ctx.stroke();
      
      // Show coordinates
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Handle detected: ${handle.position} at (${handle.x}, ${handle.y})`, 10, 20);
      ctx.fillText(`Mouse at: (${x.toFixed(1)}, ${y.toFixed(1)})`, 10, 40);
      
      // Calculate and display distance
      const distance = Math.sqrt((x-handle.x)**2 + (y-handle.y)**2);
      ctx.fillText(`Distance: ${distance.toFixed(2)} (HANDLE_RADIUS: ${HANDLE_RADIUS}, Hit Radius: ${HANDLE_RADIUS + 10})`, 10, 60);
      ctx.fillText(`Inside visual area: ${distance <= HANDLE_RADIUS ? 'YES' : 'NO'}`, 10, 80);
      ctx.fillText(`Inside hit area: ${distance <= HANDLE_RADIUS + 10 ? 'YES' : 'NO'}`, 10, 100);
    } else {
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`No handle detected`, 10, 20);
      ctx.fillText(`Mouse at: (${x.toFixed(1)}, ${y.toFixed(1)})`, 10, 40);
      
      // Show closest handle and distance
      const topDistance = Math.sqrt((x-topHandlePos.x)**2 + (y-topHandlePos.y)**2);
      const bottomDistance = Math.sqrt((x-bottomHandlePos.x)**2 + (y-bottomHandlePos.y)**2);
      const closestHandle = topDistance < bottomDistance ? 'TOP' : 'BOTTOM';
      const closestDistance = Math.min(topDistance, bottomDistance);
      
      ctx.fillText(`Closest handle: ${closestHandle}, Distance: ${closestDistance.toFixed(2)}`, 10, 60);
      ctx.fillText(`Visual radius: ${HANDLE_RADIUS}, Hit radius: ${HANDLE_RADIUS + 10}`, 10, 80);
    }
    
    // Draw debug controls
    drawDebugControls();
  }
  
  // Draw coordinate grid
  function drawGrid() {
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      // Draw coordinate labels
      if (x % 100 === 0) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(x.toString(), x, 10);
      }
    }
    
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      
      // Draw coordinate labels
      if (y % 100 === 0) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(y.toString(), 20, y + 10);
      }
    }
  }
  
  // Initial render
  renderFrame(canvas.width / 2, canvas.height / 2);
  
  // Add instructions
  const instructions = document.createElement('div');
  instructions.style.cssText = 'margin-top: 10px; font-family: sans-serif; font-size: 14px;';
  instructions.innerHTML = `
    <h3>Handle Selection Test</h3>
    <p>This visual test demonstrates the difference between visual handle size and hit detection area.</p>
    <ul>
      <li><span style="color: #4caf50;">Green circle</span>: The handle as drawn on the canvas (${HANDLE_RADIUS}px)</li>
      <li><span style="color: #ff0000;">Red circle</span>: The expanded hit detection area (${HANDLE_RADIUS + 10}px)</li>
      <li><span style="color: #ffff00;">Yellow circle</span>: Active hit detection area when mouse is over a handle</li>
      <li><span style="color: #ff0000;">Red crosshair</span>: Actual mouse position</li>
      <li><span style="color: #0000ff;">Blue circle</span>: Distance from mouse to handle center</li>
    </ul>
    <p>The hit detection area is deliberately larger than the visual circle to make interaction easier and compensate for cursor offset issues.</p>
  `;
  
  const container = document.createElement('div');
  container.appendChild(canvas);
  container.appendChild(instructions);
  
  return container;
} 