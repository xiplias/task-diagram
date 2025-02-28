import { describe, it, expect, vi } from 'vitest';
import { RendererFactory, RendererType } from '../RendererFactory';
import { IRenderer } from '../IRenderer';
import { Task, Dependency, createTaskId } from '../../../store/types';

describe('Renderer', () => {
  it('should be able to create different renderer types', () => {
    // Test creation of Canvas renderer
    const canvasRenderer = RendererFactory.createRenderer(RendererType.Canvas);
    expect(canvasRenderer).toBeDefined();
    expect(canvasRenderer.getType()).toBe(RendererType.Canvas);
    
    // Test creation of React renderer
    const reactRenderer = RendererFactory.createRenderer(RendererType.React);
    expect(reactRenderer).toBeDefined();
    expect(reactRenderer.getType()).toBe(RendererType.React);
    
    // Test creation of WebGL renderer
    const webglRenderer = RendererFactory.createRenderer(RendererType.WebGL);
    expect(webglRenderer).toBeDefined();
    expect(webglRenderer.getType()).toBe(RendererType.WebGL);
  });
  
  it('should have the required methods for all renderers', () => {
    const renderers = [
      RendererFactory.createRenderer(RendererType.Canvas),
      RendererFactory.createRenderer(RendererType.React),
      RendererFactory.createRenderer(RendererType.WebGL)
    ];
    
    for (const renderer of renderers) {
      expect(typeof renderer.initialize).toBe('function');
      expect(typeof renderer.render).toBe('function');
      expect(typeof renderer.cleanup).toBe('function');
      expect(typeof renderer.getType).toBe('function');
      expect(typeof renderer.handleMouseDown).toBe('function');
      expect(typeof renderer.handleMouseMove).toBe('function');
      expect(typeof renderer.handleMouseUp).toBe('function');
    }
  });
  
  it('should initialize and render with the correct data', () => {
    // Sample tasks and dependencies for testing
    const tasks: Task[] = [
      { id: createTaskId('1'), name: 'Task 1', x: 100, y: 100 },
      { id: createTaskId('2'), name: 'Task 2', x: 300, y: 100 }
    ];
    
    const dependencies: Dependency[] = [
      { from: createTaskId('1'), to: createTaskId('2') }
    ];
    
    const renderer = RendererFactory.createRenderer(RendererType.Canvas);
    
    // Mock DOM elements for testing
    const mockContainer = document.createElement('div');
    
    // Initialize renderer with container
    renderer.initialize(mockContainer, 800, 600);
    
    // Render the tasks and dependencies
    renderer.render({
      tasks,
      dependencies,
      selectedTaskId: null,
      hoveredHandle: null,
      draggedHandle: null,
      mousePos: null,
      width: 800,
      height: 600
    });
    
    // We don't need to test the actual rendering result here,
    // just that the method can be called without errors
    
    // Test cleanup
    renderer.cleanup();
  });
}); 