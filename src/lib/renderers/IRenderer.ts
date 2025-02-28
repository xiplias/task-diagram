import { Task, Dependency, TaskId } from '../../store/types';
import { ConnectionHandle } from '../canvas/handleUtils';

// Common render properties for all renderers
export interface RenderProps {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: TaskId | null;
  hoveredHandle: ConnectionHandle | null;
  draggedHandle: ConnectionHandle | null;
  mousePos: { x: number, y: number } | null;
  width: number;
  height: number;
  debugOptions?: DebugOptions;
}

// Debug visualization options
export interface DebugOptions {
  showHitRadius: boolean;
  showCoordinateGrid: boolean;
  showDistanceCircles: boolean;
  useAdjustedCoordinates: boolean;
  // Additional rendering options
  renderConnections?: boolean;
  renderNodes?: boolean;
  renderHandles?: boolean;
  renderOnlyDragConnections?: boolean;
}

// Default debug options
export const defaultDebugOptions: DebugOptions = {
  showHitRadius: false,
  showCoordinateGrid: false,
  showDistanceCircles: false,
  useAdjustedCoordinates: true,
  renderConnections: true,
  renderNodes: true,
  renderHandles: true,
  renderOnlyDragConnections: false
};

/**
 * Renderer interface that all rendering implementations must implement
 */
export interface IRenderer {
  /**
   * Initialize the renderer with the container and dimensions
   */
  initialize(container: HTMLElement, width: number, height: number): void;
  
  /**
   * Render the diagram with the current state
   */
  render(props: RenderProps): void;
  
  /**
   * Clean up any resources when component unmounts
   */
  cleanup(): void;
  
  /**
   * Get the renderer type
   */
  getType(): string;
  
  /**
   * Handle mouse down events
   */
  handleMouseDown(e: React.MouseEvent<HTMLElement> | MouseEvent): void;
  
  /**
   * Handle mouse move events
   */
  handleMouseMove(e: React.MouseEvent<HTMLElement> | MouseEvent): void;
  
  /**
   * Handle mouse up events
   */
  handleMouseUp(e: React.MouseEvent<HTMLElement> | MouseEvent): void;
} 