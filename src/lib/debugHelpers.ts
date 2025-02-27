/**
 * Utility functions for debugging mouse and cursor positions
 */

interface PositionData {
  clientX: number;
  clientY: number;
  elementX: number;
  elementY: number;
  targetElement: HTMLElement | null;
  targetRect: DOMRect | null;
}

/**
 * Creates a debug overlay that shows mouse position and calculated positions
 * @param options Configuration options
 * @returns A function to remove the debug overlay
 */
export function createMouseDebugOverlay(options: {
  trackPointer?: boolean;
  showElementInfo?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
} = {}) {
  const {
    trackPointer = true,
    showElementInfo = true,
    position = 'top-right',
  } = options;

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'mouse-debug-overlay';
  
  // Set position based on option
  let positionStyle = '';
  switch (position) {
    case 'top-right':
      positionStyle = 'top: 10px; right: 10px;';
      break;
    case 'top-left':
      positionStyle = 'top: 10px; left: 10px;';
      break;
    case 'bottom-right':
      positionStyle = 'bottom: 10px; right: 10px;';
      break;
    case 'bottom-left':
      positionStyle = 'bottom: 10px; left: 10px;';
      break;
  }
  
  overlay.style.cssText = `
    position: fixed;
    ${positionStyle}
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 4px;
    z-index: 10000;
    font-family: monospace;
    font-size: 12px;
    min-width: 200px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  `;
  
  // Create data displays
  const displays = {
    client: document.createElement('div'),
    offset: document.createElement('div'),
    element: document.createElement('div'),
    calculated: document.createElement('div'),
    elementInfo: document.createElement('div'),
  };

  displays.client.textContent = 'Client: 0, 0';
  displays.offset.textContent = 'Offset: 0, 0';
  displays.element.textContent = 'Element: 0, 0';
  displays.calculated.textContent = 'Calculated: 0, 0';
  displays.elementInfo.textContent = 'Target: None';

  // Add displays to overlay
  overlay.appendChild(displays.client);
  overlay.appendChild(displays.offset);
  overlay.appendChild(displays.calculated);
  
  if (showElementInfo) {
    overlay.appendChild(displays.element);
    overlay.appendChild(displays.elementInfo);
  }
  
  document.body.appendChild(overlay);
  
  // Create pointer indicator if requested
  let pointer: HTMLElement | null = null;
  if (trackPointer) {
    pointer = document.createElement('div');
    pointer.id = 'true-mouse-pointer';
    pointer.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: red;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: none;
      mix-blend-mode: difference;
      box-shadow: 0 0 0 1px white;
    `;
    document.body.appendChild(pointer);
  }
  
  // Track mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    const data: PositionData = {
      clientX: e.clientX,
      clientY: e.clientY,
      elementX: 0,
      elementY: 0,
      targetElement: null,
      targetRect: null,
    };
    
    // Update displays
    displays.client.textContent = `Client: ${e.clientX}, ${e.clientY}`;
    displays.offset.textContent = `Offset: ${e.offsetX}, ${e.offsetY}`;
    
    // Get element information
    if (e.target instanceof HTMLElement) {
      data.targetElement = e.target;
      data.targetRect = e.target.getBoundingClientRect();
      data.elementX = data.clientX - data.targetRect.left;
      data.elementY = data.clientY - data.targetRect.top;
      
      displays.element.textContent = `Element: ${Math.round(data.targetRect.left)}, ${Math.round(data.targetRect.top)}`;
      displays.calculated.textContent = `Calculated: ${Math.round(data.elementX)}, ${Math.round(data.elementY)}`;
      displays.elementInfo.textContent = `Target: ${getElementInfo(e.target)}`;
    }
    
    // Move pointer indicator if present
    if (pointer) {
      pointer.style.left = `${e.clientX}px`;
      pointer.style.top = `${e.clientY}px`;
    }
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (pointer && pointer.parentNode) {
      pointer.parentNode.removeChild(pointer);
    }
  };
}

/**
 * Get concise debug info about an element
 */
function getElementInfo(element: HTMLElement): string {
  const id = element.id ? `#${element.id}` : '';
  const classes = Array.from(element.classList).map(c => `.${c}`).join('');
  const tag = element.tagName.toLowerCase();
  
  return `${tag}${id}${classes}`;
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