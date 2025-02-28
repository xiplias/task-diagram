/**
 * Helper utilities for canvas operations
 */

/**
 * Gets the mouse position from an event relative to a target element
 */
export function getMousePosition(event: MouseEvent | React.MouseEvent, element: HTMLElement): { x: number, y: number } {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
} 