import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderCanvas } from '../canvas';

// Mock canvas context
class MockContext {
  constructor() {
    this.clearRect = vi.fn();
    this.beginPath = vi.fn();
    this.moveTo = vi.fn();
    this.lineTo = vi.fn();
    this.fillRect = vi.fn();
    this.strokeRect = vi.fn();
    this.fill = vi.fn();
    this.stroke = vi.fn();
    this.fillText = vi.fn();
  }
}

describe('Canvas Renderer', () => {
  let ctx;
  
  beforeEach(() => {
    // Reset mocks before each test
    ctx = new MockContext();
  });
  
  it('should clear canvas and render tasks and dependencies', () => {
    const tasks = [
      { id: 'task1', name: 'Task 1', x: 100, y: 100 },
      { id: 'task2', name: 'Task 2', x: 200, y: 200 }
    ];
    const dependencies = [{ from: 'task1', to: 'task2' }];
    const selectedTask = 'task1';
    const width = 800;
    const height = 600;
    
    renderCanvas(ctx, tasks, dependencies, selectedTask, width, height);
    
    // Verify clearRect was called with full canvas dimensions
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, width, height);
    
    // Verify a path was created for dependencies
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalled();
    expect(ctx.lineTo).toHaveBeenCalled();
    
    // Verify rectangles were drawn for tasks
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.strokeRect).toHaveBeenCalled();
    
    // Verify text was drawn for task names
    expect(ctx.fillText).toHaveBeenCalled();
  });
}); 