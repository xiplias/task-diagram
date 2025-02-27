import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskDiagram from '../TaskDiagram/TaskDiagram';
import '@testing-library/jest-dom';

// Mock our hooks to avoid complex testing
vi.mock('../../hooks/useTaskStorage', () => ({
  useTaskStorage: vi.fn()
}));

vi.mock('../../hooks/useTaskLayout', () => ({
  useTaskLayout: vi.fn()
}));

vi.mock('../../hooks/useCanvasInteraction', () => ({
  useCanvasInteraction: vi.fn(() => vi.fn())
}));

// Mock canvas renderer
vi.mock('../../lib/canvasRenderer', () => ({
  renderCanvas: vi.fn()
}));

describe('TaskDiagram Component', () => {
  // Mock canvas and context
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock canvas getContext
    const mockCanvasContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn()
    } as unknown as CanvasRenderingContext2D;
    
    // Mocking getContext with a simpler approach
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      (contextId: string) => contextId === '2d' ? mockCanvasContext : null
    );
  });

  it('renders the main components', () => {
    render(<TaskDiagram />);
    
    // Check for buttons instead of canvas (which doesn't have proper role)
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    
    // Check for instructions about connection handles
    expect(screen.getByText(/Click and drag from a connection handle.*to create a dependency/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a task and click "Delete Task" to remove it/i)).toBeInTheDocument();
  });

  it('renders canvas with proper attributes', () => {
    const { container } = render(<TaskDiagram />);
    
    // Find canvas element
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    // Check for height, width, and other attributes
    expect(canvas).toHaveAttribute('width');
    expect(canvas).toHaveAttribute('height');
  });
}); 