import { HANDLE_RADIUS, NODE_WIDTH, NODE_HEIGHT, CONTAINER_PADDING } from './constants';
import { findHandleAtPosition } from './handleUtils';
import { createTaskId } from '../../store/types';

/**
 * This function creates a canvas element for visual testing of the handle selection area.
 * You can run this in a browser environment to visually verify the handle selection area.
 * 
 * Instructions to use this function:
 * 1. Call this function in a browser context
 * 2. It will create a canvas element and draw a mock task node with handles
 * 3. The green area shows the circle that is drawn on the canvas
 * 4. The red translucent circle shows the exact hit detection area
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
    showGrid: false,
    adjustedCoordinates: true, // Use adjusted coordinates by default
    showDistanceCircles: true
  };
  
  // Draw task node
  ctx.fillStyle = '#1976d2';
  ctx.fillRect(TASK_X - NODE_WIDTH/2, TASK_Y - NODE_HEIGHT/2, NODE_WIDTH, NODE_HEIGHT);
  
  // Find handle positions
  const topHandlePos = { x: TASK_X, y: TASK_Y - NODE_HEIGHT/2 };
  const bottomHandlePos = { x: TASK_X, y: TASK_Y + NODE_HEIGHT/2 };
  
  function drawDebugControls() {
    // Draw debug controls panel background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(canvas.width - 250, 10, 240, 140);
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(canvas.width - 250, 10, 240, 140);
    
    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Debug Controls', canvas.width - 240, 30);
    
    // Draw controls
    ctx.font = '12px sans-serif';
    
    // Check boxes for toggles
    function drawCheckbox(x: number, y: number, isChecked: boolean) {
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x, y - 10, 14, 14);
      if (isChecked) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(x + 3, y - 7, 8, 8);
      }
    }
    
    // Draw options
    drawCheckbox(canvas.width - 240, 50, debugState.showHitRadius);
    ctx.fillStyle = 'black';
    ctx.fillText('Show Hit Radius', canvas.width - 220, 50);
    
    drawCheckbox(canvas.width - 240, 70, debugState.showGrid);
    ctx.fillText('Show Coordinate Grid', canvas.width - 220, 70);
    
    drawCheckbox(canvas.width - 240, 90, debugState.adjustedCoordinates);
    ctx.fillText('Use Adjusted Coordinates', canvas.width - 220, 90);
    
    drawCheckbox(canvas.width - 240, 110, debugState.showDistanceCircles);
    ctx.fillText('Show Distance Circles', canvas.width - 220, 110);
    
    // Add radius value display
    ctx.fillText(`HANDLE_RADIUS: ${HANDLE_RADIUS}`, canvas.width - 240, 130);
  }
  
  // Draw the handle the same way it's drawn in the actual application
  function drawAppHandle(x: number, y: number) {
    // White backing circle
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Green handle circle - EXACTLY matching the implementation in nodeRenderer.ts
    ctx.beginPath();
    ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#4caf50';  // This is what the user would see
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Draw coordinate grid for debugging
  function drawGrid() {
    const gridSize = 20;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      // Add coordinates at top
      if (x % 100 === 0) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${x}`, x + 2, 12);
      }
    }
    
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      
      // Add coordinates at left
      if (y % 100 === 0) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${y}`, 2, y + 12);
      }
    }
  }
  
  // Draw the handles as they would appear in the app
  drawAppHandle(topHandlePos.x, topHandlePos.y);
  drawAppHandle(bottomHandlePos.x, bottomHandlePos.y);
  
  // Draw distance circles for clarity
  function drawDistanceCircles(handleX: number, handleY: number) {
    // Draw exact radius circle - this is the TRUE hit detection boundary
    ctx.beginPath();
    ctx.arc(handleX, handleY, HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'; // Translucent red fill
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw beyond radius circle
    ctx.beginPath();
    ctx.arc(handleX, handleY, HANDLE_RADIUS + 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Add click handlers for the debug controls
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is in debug controls area
    if (x >= canvas.width - 250 && x <= canvas.width - 10 && y >= 10 && y <= 150) {
      // Check which control was clicked
      if (x >= canvas.width - 240 && x <= canvas.width - 226) {
        // Checkbox column
        if (y >= 40 && y <= 54) {
          debugState.showHitRadius = !debugState.showHitRadius;
        } else if (y >= 60 && y <= 74) {
          debugState.showGrid = !debugState.showGrid;
        } else if (y >= 80 && y <= 94) {
          debugState.adjustedCoordinates = !debugState.adjustedCoordinates;
        } else if (y >= 100 && y <= 114) {
          debugState.showDistanceCircles = !debugState.showDistanceCircles;
        }
      }
    }
  });
  
  // Implement the EXACT same coordinate calculation as in the application
  function getAdjustedCoordinates(clientX: number, clientY: number, rect: DOMRect) {
    // Calculate the scale factor in case the canvas is being scaled by CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply the scale factor to get the actual canvas coordinates
    const x = (clientX - rect.left) * scaleX - CONTAINER_PADDING;
    const y = (clientY - rect.top) * scaleY - CONTAINER_PADDING;
    
    return { x, y };
  }
  
  // Add hit detection visualization with improved coordinate calculation
  canvas.addEventListener('mousemove', (e) => {
    // Get the precise mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (debugState.adjustedCoordinates) {
      // Use the same adjusted coordinates as in the application
      const coords = getAdjustedCoordinates(e.clientX, e.clientY, rect);
      x = coords.x;
      y = coords.y;
    } else {
      // Use direct coordinates without scaling adjustment
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Create a mock task for testing
    const mockTask = {
      id: createTaskId('visual-test'),
      name: 'Visual Test',
      x: TASK_X,
      y: TASK_Y
    };
    
    // Check if mouse is over a handle - using EXACTLY the same function as the app
    const handle = findHandleAtPosition([mockTask], x, y);
    
    // Redraw canvas to clear previous highlighting
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (debugState.showGrid) {
      drawGrid();
    }
    
    // Draw task node again
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(TASK_X - NODE_WIDTH/2, TASK_Y - NODE_HEIGHT/2, NODE_WIDTH, NODE_HEIGHT);
    
    // Redraw handles
    drawAppHandle(topHandlePos.x, topHandlePos.y);
    drawAppHandle(bottomHandlePos.x, bottomHandlePos.y);
    
    // Draw distance circles if enabled
    if (debugState.showDistanceCircles) {
      drawDistanceCircles(topHandlePos.x, topHandlePos.y);
      drawDistanceCircles(bottomHandlePos.x, bottomHandlePos.y);
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
    
    // Draw a circle with exact HANDLE_RADIUS at the mouse position if enabled
    if (debugState.showHitRadius) {
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, HANDLE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw hit detection visualization
    if (handle) {
      // Draw a yellow box to show the active hit area
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, HANDLE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw a line from mouse to handle center to visualize distance
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(handle.x, handle.y);
      ctx.stroke();
      
      // Show coordinates
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Handle detected: ${handle.position} at (${handle.x}, ${handle.y})`, 10, 20);
      ctx.fillText(`Mouse at: (${x.toFixed(1)}, ${y.toFixed(1)})`, 10, 40);
      
      // Calculate and display distance
      const distance = Math.sqrt((x-handle.x)**2 + (y-handle.y)**2);
      ctx.fillText(`Distance: ${distance.toFixed(2)} (HANDLE_RADIUS: ${HANDLE_RADIUS})`, 10, 60);
      ctx.fillText(`Inside detection area: ${distance <= HANDLE_RADIUS ? 'YES' : 'NO'}`, 10, 80);
    } else {
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.fillText(`No handle detected`, 10, 20);
      ctx.fillText(`Mouse at: (${x.toFixed(1)}, ${y.toFixed(1)})`, 10, 40);
      
      // Show closest handle and distance
      const topDistance = Math.sqrt((x-topHandlePos.x)**2 + (y-topHandlePos.y)**2);
      const bottomDistance = Math.sqrt((x-bottomHandlePos.x)**2 + (y-bottomHandlePos.y)**2);
      const closestHandle = topDistance < bottomDistance ? 'TOP' : 'BOTTOM';
      const closestDistance = Math.min(topDistance, bottomDistance);
      
      ctx.fillText(`Closest handle: ${closestHandle}, Distance: ${closestDistance.toFixed(2)}`, 10, 60);
      ctx.fillText(`Detection threshold: ${HANDLE_RADIUS}`, 10, 80);
    }
    
    // Draw debug controls
    drawDebugControls();
  });
  
  // Initial debug controls
  drawDebugControls();
  
  // Add instructions
  ctx.fillStyle = 'black';
  ctx.font = '14px sans-serif';
  ctx.fillText('Green circle: The handle as drawn on the canvas', 10, 580);
  ctx.fillText('Red translucent circle: EXACT hit detection boundary', 10, 560);
  ctx.fillText('Blue outline: Area just beyond detection radius', 10, 540);
  ctx.fillText('Yellow circle: Active hit detection area when mouse is over a handle', 10, 520);
  ctx.fillText('Red crosshair: Actual mouse position', 10, 500);
  ctx.fillText('Pink circle: HANDLE_RADIUS around mouse position', 10, 480);
  
  return canvas;
} 