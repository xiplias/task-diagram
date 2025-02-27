import { describe, it, expect, vi } from 'vitest';
import { layoutTasks } from '../layoutUtils';

// Mock dagre for testing
vi.mock('@dagrejs/dagre', () => {
  return {
    default: {
      graphlib: {
        Graph: vi.fn().mockImplementation(() => {
          return {
            setGraph: vi.fn(),
            setDefaultEdgeLabel: vi.fn(),
            setNode: vi.fn(),
            setEdge: vi.fn(),
            nodes: vi.fn().mockReturnValue(['task1', 'task2']),
            node: vi.fn((id) => {
              if (id === 'task1') return { x: 150, y: 100, width: 100, height: 50 };
              if (id === 'task2') return { x: 150, y: 200, width: 100, height: 50 };
              return {};
            })
          };
        })
      },
      layout: vi.fn()
    }
  };
});

describe('Layout Utils', () => {
  it('should calculate task layout using dagre', () => {
    const tasks = [
      { id: 'task1', name: 'Task 1', x: 0, y: 0 },
      { id: 'task2', name: 'Task 2', x: 0, y: 0 }
    ];
    
    const dependencies = [{ from: 'task1', to: 'task2' }];
    
    const newLayout = layoutTasks(tasks, dependencies);
    
    // Verify we got updated positions from our mock implementation
    expect(newLayout).toHaveLength(2);
    expect(newLayout[0].x).toBe(150);
    expect(newLayout[0].y).toBe(100);
    expect(newLayout[1].x).toBe(150);
    expect(newLayout[1].y).toBe(200);
  });

  it('should preserve task properties during layout', () => {
    const tasks = [
      { id: 'task1', name: 'Task 1', x: 0, y: 0, customProp: 'value1' },
      { id: 'task2', name: 'Task 2', x: 0, y: 0, customProp: 'value2' }
    ];
    
    const dependencies = [{ from: 'task1', to: 'task2' }];
    
    const newLayout = layoutTasks(tasks, dependencies);
    
    // Verify properties are preserved
    expect(newLayout[0].customProp).toBe('value1');
    expect(newLayout[1].customProp).toBe('value2');
  });

  it('should handle empty tasks and dependencies', () => {
    const tasks = [];
    const dependencies = [];
    
    const newLayout = layoutTasks(tasks, dependencies);
    
    expect(newLayout).toEqual([]);
  });
}); 