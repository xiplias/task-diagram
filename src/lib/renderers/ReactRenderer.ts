import React, { createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { IRenderer, RenderProps } from './IRenderer';
import { RendererType } from './RendererFactory';
import ReactDiagramContainer from '../../components/ReactDiagram/ReactDiagramContainer';

/**
 * React-based renderer implementation
 */
export class ReactRenderer implements IRenderer {
  private container: HTMLElement | null = null;
  private root: ReactDOM.Root | null = null;
  private _width: number = 0;
  private _height: number = 0;
  private _currentProps: RenderProps | null = null;

  // Event handlers
  private onMouseDown: ((e: React.MouseEvent<HTMLElement>) => void) | null = null;
  private onMouseMove: ((e: React.MouseEvent<HTMLElement>) => void) | null = null;
  private onMouseUp: ((e: React.MouseEvent<HTMLElement>) => void) | null = null;

  /**
   * Initialize the React renderer
   */
  initialize(container: HTMLElement, width: number, height: number): void {
    this.container = container;
    this._width = width;
    this._height = height;

    // Create a div for React to render into
    const reactRoot = document.createElement('div');
    reactRoot.id = 'react-diagram-root';
    reactRoot.style.width = `${width}px`;
    reactRoot.style.height = `${height}px`;
    reactRoot.style.position = 'relative';
    
    // Clear container and append our root
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(reactRoot);

    // Create React root
    this.root = ReactDOM.createRoot(reactRoot);
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
      this.container = null;
    }
  }

  /**
   * Get renderer type
   */
  getType(): string {
    return RendererType.React;
  }

  /**
   * Set callbacks for mouse events
   */
  setCallbacks(
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => void,
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void,
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => void
  ): void {
    this.onMouseDown = onMouseDown;
    this.onMouseMove = onMouseMove;
    this.onMouseUp = onMouseUp;
  }

  /**
   * Render the diagram using React components
   */
  render(props: RenderProps): void {
    if (!this.root) return;
    
    this._currentProps = props;
    
    // Create React element with the current props
    const reactElement = createElement(ReactDiagramContainer, {
      ...props,
      onMouseDown: this.handleMouseDown,
      onMouseMove: this.handleMouseMove,
      onMouseUp: this.handleMouseUp
    });
    
    // Render React component
    this.root.render(reactElement);
  }

  /**
   * Handle mouse down event
   */
  handleMouseDown = (e: React.MouseEvent<HTMLElement>): void => {
    if (this.onMouseDown) {
      this.onMouseDown(e);
    }
  };

  /**
   * Handle mouse move event
   */
  handleMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    if (this.onMouseMove) {
      this.onMouseMove(e);
    }
  };

  /**
   * Handle mouse up event
   */
  handleMouseUp = (e: React.MouseEvent<HTMLElement>): void => {
    if (this.onMouseUp) {
      this.onMouseUp(e);
    }
  };
} 