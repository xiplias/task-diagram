/**
 * Utility functions for debugging mouse and cursor positions
 */

import { HANDLE_RADIUS } from './canvas/constants';

interface PositionData {
  clientX: number;
  clientY: number;
  elementX: number;
  elementY: number;
  targetElement: HTMLElement | null;
  targetRect: DOMRect | null;
  nearestHandleDistance?: number;
  isInsideHitRadius?: boolean;
}

/**
 * Creates a simplified debug overlay that shows mouse position data
 * @returns A function to remove the debug overlay
 */
export function createMouseDebugOverlay() {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'mouse-debug-overlay';
  
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 4px;
    z-index: 10000;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  `;
  
  // Create content element
  const content = document.createElement('div');
  overlay.appendChild(content);
  
  // Add to DOM
  document.body.appendChild(overlay);
  
  // Track mouse position
  const handleMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetRect = target?.getBoundingClientRect() || null;
    
    const positionData: PositionData = {
      clientX: e.clientX,
      clientY: e.clientY,
      elementX: targetRect ? e.clientX - targetRect.left : 0,
      elementY: targetRect ? e.clientY - targetRect.top : 0,
      targetElement: target,
      targetRect: targetRect
    };
    
    // Check if we're on a canvas element
    if (target instanceof HTMLCanvasElement && target.closest('.task-diagram')) {
      // Calculate coordinates relative to the canvas
      const canvasX = e.clientX - targetRect.left;
      const canvasY = e.clientY - targetRect.top;
      
      // Find tasks in the DOM 
      // This is a simplification - we're just looking for tasks visually
      const taskElements = document.querySelectorAll('.task-node');
      
      let minDistance = Infinity;
      let isInsideHitRadius = false;
      
      // If we found task elements, calculate distances to their handles
      if (taskElements.length > 0) {
        taskElements.forEach(taskElement => {
          const taskRect = taskElement.getBoundingClientRect();
          const taskCenterX = taskRect.left + taskRect.width / 2 - targetRect.left;
          const taskCenterY = taskRect.top + taskRect.height / 2 - targetRect.top;
          
          // Top and bottom handles are at the vertical center of the task
          const handlePositions = [
            { x: taskCenterX, y: taskCenterY - 50 }, // Top handle (estimation)
            { x: taskCenterX, y: taskCenterY + 50 }  // Bottom handle (estimation)
          ];
          
          for (const handlePos of handlePositions) {
            const dx = canvasX - handlePos.x;
            const dy = canvasY - handlePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
              minDistance = distance;
              isInsideHitRadius = distance <= (HANDLE_RADIUS + 10); // Using the hit detection radius
            }
          }
        });
      } else {
        // If no task elements found, check if there are visual handles in the canvas
        // This is a hacky approach but works for debug overlay purposes
        const diagramElement = document.querySelector('.task-diagram');
        if (diagramElement) {
          // Extract positions from the debug data attributes if available
          const handleElements = document.querySelectorAll('[data-handle-position]');
          
          handleElements.forEach(handleElement => {
            try {
              const position = JSON.parse(handleElement.getAttribute('data-handle-position') || '{}');
              if (position.x !== undefined && position.y !== undefined) {
                const dx = canvasX - position.x;
                const dy = canvasY - position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                  minDistance = distance;
                  isInsideHitRadius = distance <= (HANDLE_RADIUS + 10);
                }
              }
            } catch (err) {
              // Ignore parsing errors
            }
          });
        }
      }
      
      // If we found a minimum distance, add it to position data
      if (minDistance !== Infinity) {
        positionData.nearestHandleDistance = Math.round(minDistance * 100) / 100;
        positionData.isInsideHitRadius = isInsideHitRadius;
      }
    }
    
    // Update content with position data
    content.innerHTML = formatPositionData(positionData);
  };
  
  // Add mouse move listener
  document.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.body.removeChild(overlay);
  };
}

/**
 * Format position data as HTML string
 */
function formatPositionData(data: PositionData): string {
  let html = `
    <div>Mouse Position (client): ${data.clientX}, ${data.clientY}</div>
    <div>Element Position: ${data.elementX.toFixed(1)}, ${data.elementY.toFixed(1)}</div>
    <div>Target Element: ${data.targetElement?.tagName || 'none'}</div>
  `;
  
  // Add distance to nearest handle if available
  if (data.nearestHandleDistance !== undefined) {
    const visualRadius = HANDLE_RADIUS;
    const hitRadius = HANDLE_RADIUS + 10;
    
    const distanceColor = data.isInsideHitRadius ? '#4caf50' : '#f44336';
    const distanceToBoundary = Math.abs(data.nearestHandleDistance - hitRadius);
    const boundaryText = data.nearestHandleDistance <= hitRadius ? 
      `${distanceToBoundary.toFixed(2)}px inside boundary` : 
      `${distanceToBoundary.toFixed(2)}px outside boundary`;
    
    const percentOfHitRadius = ((data.nearestHandleDistance / hitRadius) * 100).toFixed(1);
    
    html += `
      <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px;">
        <div style="font-size: 14px; margin-bottom: 5px;">
          <span style="font-weight: bold;">Distance: </span>
          <span style="color:${distanceColor}; font-weight: bold; font-size: 16px;">${data.nearestHandleDistance}px</span>
        </div>
        
        <div style="display: flex; margin-bottom: 8px;">
          <div style="flex: 1; text-align: center; background: rgba(255,255,255,0.1); padding: 5px; border-radius: 3px;">
            <div style="font-size: 10px; color: #aaa;">VISUAL</div>
            <div style="font-weight: bold;">${visualRadius}px</div>
          </div>
          <div style="width: 8px;"></div>
          <div style="flex: 1; text-align: center; background: rgba(255,255,255,0.1); padding: 5px; border-radius: 3px;">
            <div style="font-size: 10px; color: #aaa;">HIT</div>
            <div style="font-weight: bold;">${hitRadius}px</div>
          </div>
          <div style="width: 8px;"></div>
          <div style="flex: 1; text-align: center; background: rgba(255,255,255,0.1); padding: 5px; border-radius: 3px;">
            <div style="font-size: 10px; color: #aaa;">%</div>
            <div style="font-weight: bold;">${percentOfHitRadius}%</div>
          </div>
        </div>
        
        <div style="margin: 10px 0; height: 20px; background: linear-gradient(to right, #4caf50, #ff9800, #f44336); border-radius: 10px; position: relative;">
          <div style="position: absolute; top: 0; bottom: 0; width: 2px; background: white; left: ${(data.nearestHandleDistance / (hitRadius * 2)) * 100}%; transform: translateX(-50%)"></div>
        </div>
        
        <div style="font-size: 12px; color: ${distanceColor}; text-align: center; margin-bottom: 8px;">
          ${boundaryText}
        </div>
        
        <div style="text-align: center; padding: 6px; border-radius: 4px; background: ${data.isInsideHitRadius ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)'}; color: ${distanceColor}; font-weight: bold;">
          ${data.isInsideHitRadius ? 'INSIDE HIT RADIUS' : 'OUTSIDE HIT RADIUS'}
        </div>
      </div>
    `;
  }
  
  return html;
}

/**
 * Add a debug mode that can be toggled with a keyboard shortcut
 * @param keyCode Key code to toggle debug mode (default: 'd')
 */
export function setupDebugMode(keyCode = 'd') {
  let cleanup: (() => void) | null = null;
  let isActive = false;
  
  const toggle = (e: KeyboardEvent) => {
    // Activate only with Ctrl+Shift+[keyCode]
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === keyCode) {
      if (isActive && cleanup) {
        cleanup();
        cleanup = null;
        isActive = false;
        console.log('Debug mode deactivated');
      } else {
        cleanup = createMouseDebugOverlay();
        isActive = true;
        console.log('Debug mode activated');
      }
    }
  };
  
  document.addEventListener('keydown', toggle);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', toggle);
    if (cleanup) {
      cleanup();
    }
  };
} 