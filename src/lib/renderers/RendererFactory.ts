import { IRenderer } from './IRenderer';
import { CanvasRenderer } from './CanvasRenderer';
import { ReactRenderer } from './ReactRenderer';
import { WebGLRenderer } from './WebGLRenderer';

/**
 * Enum for available renderer types
 */
export enum RendererType {
  Canvas = 'canvas',
  React = 'react',
  WebGL = 'webgl'
}

/**
 * Factory for creating renderers
 */
export class RendererFactory {
  /**
   * Create a renderer of the specified type
   */
  static createRenderer(type: RendererType): IRenderer {
    switch (type) {
      case RendererType.Canvas:
        return new CanvasRenderer();
      case RendererType.React:
        return new ReactRenderer();
      case RendererType.WebGL:
        return new WebGLRenderer();
      default:
        // Default to Canvas renderer
        console.warn(`Unknown renderer type: ${type}, falling back to Canvas renderer`);
        return new CanvasRenderer();
    }
  }
} 