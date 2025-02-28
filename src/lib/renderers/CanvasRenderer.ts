import React from 'react';
import { IRenderer, RenderProps, defaultDebugOptions } from './IRenderer';
import { RendererType } from './RendererFactory';
import { renderCanvas } from '../canvas/canvasRenderer';
import { ConnectionHandle } from '../canvas/handleUtils';

/**
 * Canvas-based renderer implementation
 */
export class CanvasRenderer implements IRenderer {
  private container: HTMLElement | null = null;
  private width: number = 0;
  private height: number = 0;
  private canvasLayers: {
    background: HTMLCanvasElement;
    dependency: HTMLCanvasElement;
    task: HTMLCanvasElement;
    interactive: HTMLCanvasElement;
  } | null = null;

  // Callbacks
  private onMouseDown: ((handle: ConnectionHandle | null, e: MouseEvent) => void) | null = null;
  private onMouseMove: ((handle: ConnectionHandle | null, e: MouseEvent) => void) | null = null;
  private onMouseUp: ((e: MouseEvent) => void) | null = null;

  /**
   * Initialize the canvas renderer
   */
  initialize(container: HTMLElement, width: number, height: number): void {
    this.container = container;
    this.width = width;
    this.height = height;

    // Create canvas layers
    this.canvasLayers = {
      background: this.createCanvasLayer('background-layer'),
      dependency: this.createCanvasLayer('dependency-layer'),
      task: this.createCanvasLayer('task-layer'),
      interactive: this.createCanvasLayer('interactive-layer'),
    };

    // Add event listeners to the interactive layer
    const interactiveCanvas = this.canvasLayers.interactive;
    interactiveCanvas.tabIndex = 0; // Make it focusable
    interactiveCanvas.addEventListener('mousedown', this.handleNativeMouseDown);
    interactiveCanvas.addEventListener('mousemove', this.handleNativeMouseMove);
    interactiveCanvas.addEventListener('mouseup', this.handleNativeMouseUp);
    
    // Append all canvases to the container
    Object.values(this.canvasLayers).forEach(canvas => {
      this.container?.appendChild(canvas);
    });
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.canvasLayers) {
      const interactiveCanvas = this.canvasLayers.interactive;
      interactiveCanvas.removeEventListener('mousedown', this.handleNativeMouseDown);
      interactiveCanvas.removeEventListener('mousemove', this.handleNativeMouseMove);
      interactiveCanvas.removeEventListener('mouseup', this.handleNativeMouseUp);
    }

    // Remove canvases from the container
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }

    this.canvasLayers = null;
    this.container = null;
  }

  /**
   * Get renderer type
   */
  getType(): string {
    return RendererType.Canvas;
  }

  /**
   * Set callbacks
   */
  setCallbacks(
    onMouseDown: (handle: ConnectionHandle | null, e: MouseEvent) => void,
    onMouseMove: (handle: ConnectionHandle | null, e: MouseEvent) => void,
    onMouseUp: (e: MouseEvent) => void
  ): void {
    this.onMouseDown = onMouseDown;
    this.onMouseMove = onMouseMove;
    this.onMouseUp = onMouseUp;
  }

  /**
   * Render the diagram
   */
  render(props: RenderProps): void {
    if (!this.canvasLayers) return;

    const { 
      tasks, 
      dependencies, 
      selectedTaskId, 
      hoveredHandle, 
      draggedHandle, 
      mousePos,
      width,
      height,
      debugOptions = defaultDebugOptions
    } = props;

    // Background layer - static elements
    const bgCtx = this.canvasLayers.background.getContext('2d');
    if (bgCtx) {
      bgCtx.clearRect(0, 0, width, height);
      // Any static background drawing would go here
    }
    
    // Dependency layer - connections between tasks
    const depCtx = this.canvasLayers.dependency.getContext('2d');
    if (depCtx) {
      renderCanvas(
        depCtx, 
        tasks, 
        dependencies, 
        null, // No selected task highlighting on this layer
        null, // No hover effect on this layer
        draggedHandle, 
        mousePos,
        width, 
        height,
        { // Only render connections on this layer
          ...debugOptions,
          showHitRadius: false,
          renderConnections: true,
          renderNodes: false,
          renderHandles: false
        }
      );
    }
    
    // Task layer - task nodes
    const taskCtx = this.canvasLayers.task.getContext('2d');
    if (taskCtx) {
      renderCanvas(
        taskCtx, 
        tasks, 
        [], // No dependencies on this layer 
        selectedTaskId,
        hoveredHandle,
        null, // No dragged handle visualization on this layer 
        null, // No mouse position needed on this layer
        width, 
        height,
        { // Only render nodes on this layer
          ...debugOptions,
          renderConnections: false,
          renderNodes: true,
          renderHandles: true
        }
      );
    }
    
    // Interactive layer - transparent, just for capturing events
    const interactiveCtx = this.canvasLayers.interactive.getContext('2d');
    if (interactiveCtx) {
      interactiveCtx.clearRect(0, 0, width, height);
      // Only render debug info or dragging visuals on this layer
      if (draggedHandle && mousePos) {
        renderCanvas(
          interactiveCtx,
          tasks,
          [],
          null,
          null,
          draggedHandle,
          mousePos,
          width,
          height,
          {
            ...debugOptions,
            renderConnections: true,
            renderNodes: false,
            renderHandles: false,
            renderOnlyDragConnections: true
          }
        );
      }
    }
  }

  // Event handling methods
  handleMouseDown(_e: React.MouseEvent<HTMLElement> | MouseEvent): void {
    // Implementation
  }

  handleMouseMove(_e: React.MouseEvent<HTMLElement> | MouseEvent): void {
    // Implementation
  }

  handleMouseUp(_e: React.MouseEvent<HTMLElement> | MouseEvent): void {
    // Implementation
  }

  /**
   * Native event handlers
   */
  private handleNativeMouseDown = (e: MouseEvent): void => {
    if (this.onMouseDown) {
      // We don't detect the handle here - it's the responsibility of the 
      // parent component to track which handle is being hovered
      this.onMouseDown(null, e);
    }
  };

  private handleNativeMouseMove = (e: MouseEvent): void => {
    if (this.onMouseMove) {
      // We don't detect the handle here - it's the responsibility of the 
      // parent component to track which handle is being hovered
      this.onMouseMove(null, e);
    }
  };

  private handleNativeMouseUp = (e: MouseEvent): void => {
    if (this.onMouseUp) {
      this.onMouseUp(e);
    }
  };

  /**
   * Helper to create a canvas layer
   */
  private createCanvasLayer(id: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.border = '1px solid #ccc';
    canvas.style.borderRadius = '4px';
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    
    // Set z-index based on layer type
    switch (id) {
      case 'background-layer':
        canvas.style.zIndex = '1';
        break;
      case 'dependency-layer':
        canvas.style.zIndex = '2';
        break;
      case 'task-layer':
        canvas.style.zIndex = '3';
        break;
      case 'interactive-layer':
        canvas.style.zIndex = '10';
        canvas.style.backgroundColor = 'transparent';
        break;
    }
    
    return canvas;
  }
} 