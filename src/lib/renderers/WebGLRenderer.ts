import React from 'react';
import { IRenderer, RenderProps, defaultDebugOptions } from './IRenderer';
import { RendererType } from './RendererFactory';

/**
 * WebGL-based renderer implementation
 */
export class WebGLRenderer implements IRenderer {
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private _width: number = 0;
  private _height: number = 0;
  private isInitialized: boolean = false;
  
  // Shaders
  private vertexShader: WebGLShader | null = null;
  private fragmentShader: WebGLShader | null = null;
  private shaderProgram: WebGLProgram | null = null;
  
  // Callbacks
  private onMouseDown: ((e: MouseEvent) => void) | null = null;
  private onMouseMove: ((e: MouseEvent) => void) | null = null;
  private onMouseUp: ((e: MouseEvent) => void) | null = null;

  /**
   * Initialize the WebGL renderer
   */
  initialize(container: HTMLElement, width: number, height: number): void {
    this.container = container;
    this._width = width;
    this._height = height;

    // Create the canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.border = '1px solid #ccc';
    this.canvas.style.borderRadius = '4px';
    
    // Clear container and append canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(this.canvas);
    
    try {
      // Get WebGL context
      this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      
      if (!this.gl) {
        throw new Error('WebGL is not supported');
      }
      
      // Initial WebGL setup
      this.setupWebGL();
      
      // Add event listeners
      this.canvas.addEventListener('mousedown', this.handleNativeMouseDown);
      this.canvas.addEventListener('mousemove', this.handleNativeMouseMove);
      this.canvas.addEventListener('mouseup', this.handleNativeMouseUp);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize WebGL renderer:', error);
      // Fallback message
      if (this.canvas) {
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f8d7da';
          ctx.fillRect(0, 0, width, height);
          ctx.font = '16px Arial';
          ctx.fillStyle = '#721c24';
          ctx.textAlign = 'center';
          ctx.fillText('WebGL not supported or failed to initialize', width / 2, height / 2);
          ctx.fillText('Please try using a different renderer', width / 2, height / 2 + 30);
        }
      }
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleNativeMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleNativeMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleNativeMouseUp);
    }
    
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
    
    // Clean up WebGL resources
    if (this.gl) {
      this.gl.deleteShader(this.vertexShader);
      this.gl.deleteShader(this.fragmentShader);
      this.gl.deleteProgram(this.shaderProgram);
    }
    
    this.canvas = null;
    this.gl = null;
    this.container = null;
    this.isInitialized = false;
  }

  /**
   * Get renderer type
   */
  getType(): string {
    return RendererType.WebGL;
  }
  
  /**
   * Set callbacks
   */
  setCallbacks(
    onMouseDown: (e: MouseEvent) => void,
    onMouseMove: (e: MouseEvent) => void,
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
    if (!this.isInitialized || !this.gl || !this.shaderProgram) {
      return;
    }
    
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
    
    const gl = this.gl;
    
    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use the shader program
    gl.useProgram(this.shaderProgram);
    
    // Here we would render tasks, dependencies, etc. with WebGL
    // This is a simplified version that would need to be expanded
    // for a complete WebGL implementation
    
    // For now, we'll render a basic grid to show that WebGL is working
    this.renderGrid(gl);
    
    // Render tasks (as colored rectangles in WebGL)
    this.renderTasks(gl, tasks, selectedTaskId);
    
    // Render dependencies (as lines in WebGL)
    this.renderDependencies(gl, tasks, dependencies);
    
    // Render dragging indicator if needed
    if (draggedHandle && mousePos) {
      this.renderDragLine(gl, draggedHandle, mousePos);
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
      this.onMouseDown(e);
    }
  };
  
  private handleNativeMouseMove = (e: MouseEvent): void => {
    if (this.onMouseMove) {
      this.onMouseMove(e);
    }
  };
  
  private handleNativeMouseUp = (e: MouseEvent): void => {
    if (this.onMouseUp) {
      this.onMouseUp(e);
    }
  };
  
  /**
   * Set up WebGL
   */
  private setupWebGL(): void {
    if (!this.gl) return;
    
    const gl = this.gl;
    
    // Vertex shader source
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;
    
    // Fragment shader source
    const fsSource = `
      precision mediump float;
      
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `;
    
    // Create the shader program
    this.vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    if (!this.vertexShader || !this.fragmentShader) {
      throw new Error('Failed to compile shaders');
    }
    
    this.shaderProgram = gl.createProgram();
    
    if (!this.shaderProgram) {
      throw new Error('Failed to create shader program');
    }
    
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);
    gl.linkProgram(this.shaderProgram);
    
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.shaderProgram));
    }
  }
  
  /**
   * Load a shader
   */
  private loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    
    if (!shader) {
      console.error('Unable to create shader');
      return null;
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  /**
   * Render a simple grid
   */
  private renderGrid(_gl: WebGLRenderingContext): void {
    // Implementation
  }
  
  /**
   * Render tasks as rectangles
   */
  private renderTasks(_gl: WebGLRenderingContext, _tasks: any[], _selectedTaskId: any): void {
    // Implementation
  }
  
  /**
   * Render dependencies as lines
   */
  private renderDependencies(_gl: WebGLRenderingContext, _tasks: any[], _dependencies: any[]): void {
    // Implementation
  }
  
  /**
   * Render a line for dragging
   */
  private renderDragLine(_gl: WebGLRenderingContext, _draggedHandle: any, _mousePos: any): void {
    // Implementation
  }
} 