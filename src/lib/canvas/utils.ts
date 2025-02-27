import { Task } from '../../store/types';

/**
 * Find a task by its ID in an array of tasks
 * @param tasks - Array of tasks to search
 * @param id - ID of the task to find
 * @returns The task if found, undefined otherwise
 */
export function findTaskById(tasks: Task[], id: string): Task | undefined {
  return tasks.find(task => task.id === id);
}

/**
 * Setup canvas context for text rendering
 * @param ctx - Canvas rendering context
 * @param font - Font specification
 * @param color - Text color
 * @param align - Text alignment (default: center)
 * @param baseline - Text baseline (default: middle)
 */
export function setupTextContext(
  ctx: CanvasRenderingContext2D,
  font: string,
  color: string,
  align: CanvasTextAlign = 'center',
  baseline: CanvasTextBaseline = 'middle'
): void {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
} 