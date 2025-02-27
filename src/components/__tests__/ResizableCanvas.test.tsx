import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import ResizableCanvas from '../TaskDiagram/ResizableCanvas';
import '@testing-library/jest-dom';

describe('ResizableCanvas Component', () => {
  // Setup mocks
  const mockRender = vi.fn();
  const mockOnMouseDown = vi.fn();
  
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
  
  it('renders canvas with correct properties', () => {
    const { container } = render(
      <ResizableCanvas 
        width={800}
        height={600}
        onMouseDown={mockOnMouseDown}
        render={mockRender}
      />
    );
    
    // Find canvas element
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    // Check for width and height attributes
    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '600');
  });
  
  it('passes the onClick handler properly', () => {
    const { container } = render(
      <ResizableCanvas 
        width={800}
        height={600}
        onMouseDown={mockOnMouseDown}
        render={mockRender}
      />
    );
    
    // Find canvas element
    const canvas = container.querySelector('canvas');
    
    // Trigger a mouse down event
    if (canvas) {
      fireEvent.mouseDown(canvas);
      
      // Verify the handler was called
      expect(mockOnMouseDown).toHaveBeenCalled();
    }
  });
  
  it('applies custom styles when provided', () => {
    const customStyle = { border: '2px solid blue' };
    
    const { container } = render(
      <ResizableCanvas 
        width={800}
        height={600}
        onMouseDown={mockOnMouseDown}
        render={mockRender}
        style={customStyle}
      />
    );
    
    // Find canvas element
    const canvas = container.querySelector('canvas');
    
    // Check that the style was merged with default styles
    expect(canvas?.style.border).toBe('2px solid blue');
  });
}); 