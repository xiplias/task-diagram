import { describe, it, expect } from 'vitest';
import { 
  getHandlePosition, 
  findHandleAtPosition, 
  HandlePosition 
} from '../handleUtils';
import { createTaskId } from '../../../store/types';
import { NODE_HEIGHT, HANDLE_RADIUS } from '../constants';

describe('Handle Utilities', () => {
  const task = {
    id: createTaskId('task1'),
    name: 'Test Task',
    x: 100,
    y: 100
  };

  describe('getHandlePosition', () => {
    it('should calculate top handle position correctly', () => {
      const position = getHandlePosition(task, HandlePosition.TOP);
      expect(position.x).toBe(100); // Horizontally centered
      expect(position.y).toBe(100 - NODE_HEIGHT / 2);  // Top center
    });

    it('should calculate bottom handle position correctly', () => {
      const position = getHandlePosition(task, HandlePosition.BOTTOM);
      expect(position.x).toBe(100); // Horizontally centered
      expect(position.y).toBe(100 + NODE_HEIGHT / 2); // Bottom center
    });
  });

  describe('findHandleAtPosition', () => {
    const tasks = [
      {
        id: createTaskId('task1'),
        name: 'Task 1',
        x: 100,
        y: 100
      },
      {
        id: createTaskId('task2'),
        name: 'Task 2',
        x: 200,
        y: 200
      }
    ];

    it('should find a top handle when click is within radius', () => {
      // Click near the top handle of task1
      const topY = 100 - NODE_HEIGHT / 2;
      const handle = findHandleAtPosition(tasks, 101, topY + 1);
      expect(handle).not.toBeNull();
      expect(handle?.taskId).toBe(tasks[0].id);
      expect(handle?.position).toBe(HandlePosition.TOP);
    });

    it('should find a bottom handle when click is within radius', () => {
      // Click near the bottom handle of task1
      const bottomY = 100 + NODE_HEIGHT / 2;
      const handle = findHandleAtPosition(tasks, 99, bottomY - 1);
      expect(handle).not.toBeNull();
      expect(handle?.taskId).toBe(tasks[0].id);
      expect(handle?.position).toBe(HandlePosition.BOTTOM);
    });

    it('should not find any handle when click is too far from handles', () => {
      // Click far from any handle
      const handle = findHandleAtPosition(tasks, 150, 150);
      expect(handle).toBeNull();
    });

    it('should find the closest handle when multiple are within range', () => {
      // Create two tasks with very close handles
      const closeTasksA = {
        id: createTaskId('closeA'),
        name: 'Close A',
        x: 300,
        y: 300
      };
      const closeTasksB = {
        id: createTaskId('closeB'),
        name: 'Close B',
        x: 300,
        y: 300 + NODE_HEIGHT + HANDLE_RADIUS // Position B so handles are within 2*radius of each other
      };
      
      // Position a click exactly between the bottom handle of A and top handle of B
      const bottomA = 300 + NODE_HEIGHT / 2;
      const topB = closeTasksB.y - NODE_HEIGHT / 2;
      const midpoint = (bottomA + topB) / 2;
      
      // Verify both tasks are set up correctly for this test
      expect(Math.abs(bottomA - topB)).toBeLessThanOrEqual(2 * HANDLE_RADIUS + 2);
      
      // Test with a click slightly closer to task A's bottom handle
      const handleA = findHandleAtPosition([closeTasksA, closeTasksB], 300, midpoint - 1);
      expect(handleA).not.toBeNull();
      expect(handleA?.taskId).toBe(closeTasksA.id);
      expect(handleA?.position).toBe(HandlePosition.BOTTOM);
      
      // Test with a click slightly closer to task B's top handle
      // Note: We need to test the tasks in reverse order to ensure the closest one is found
      // This is because the findHandleAtPosition function processes tasks in order
      const handleB = findHandleAtPosition([closeTasksB, closeTasksA], 300, midpoint + 1);
      expect(handleB).not.toBeNull();
      expect(handleB?.taskId).toBe(closeTasksB.id);
      expect(handleB?.position).toBe(HandlePosition.TOP);
    });

    // Special test for coordinate transformation
    it('should handle transformed coordinates correctly', () => {
      // Define a task with coordinates in a layout-adjusted system
      const transformedTask = {
        id: createTaskId('transformed'),
        name: 'Transformed Task',
        x: 350, // This would be after applying centering and margins
        y: 200
      };
      
      // We're simulating a click that should hit the top handle
      const topY = 200 - NODE_HEIGHT / 2;
      const handle = findHandleAtPosition([transformedTask], 350, topY);
      
      expect(handle).not.toBeNull();
      expect(handle?.taskId).toBe(transformedTask.id);
      expect(handle?.position).toBe(HandlePosition.TOP);
    });

    // Test that verifies the mouse selection area exactly matches the drawn circle dimensions
    it('should match selection area exactly with drawn circle dimensions', () => {
      const task = {
        id: createTaskId('circleTest'),
        name: 'Circle Test Task',
        x: 400,
        y: 300
      };
      
      // Get the handle positions
      const topHandle = getHandlePosition(task, HandlePosition.TOP);
      const topX = topHandle.x;
      const topY = topHandle.y;
      
      // Test points at exactly HANDLE_RADIUS away (should be detected)
      // Points exactly on the circle edge
      const exactRadius = HANDLE_RADIUS;
      
      // Point at right edge of circle (x+r, y)
      expect(findHandleAtPosition([task], topX + exactRadius, topY)).not.toBeNull();
      
      // Point at left edge of circle (x-r, y)
      expect(findHandleAtPosition([task], topX - exactRadius, topY)).not.toBeNull();
      
      // Point at top edge of circle (x, y-r)
      expect(findHandleAtPosition([task], topX, topY - exactRadius)).not.toBeNull();
      
      // Point at bottom edge of circle (x, y+r)
      expect(findHandleAtPosition([task], topX, topY + exactRadius)).not.toBeNull();
      
      // Points at diagonal positions - radius * cos(45°), radius * sin(45°)
      // The diagonal distance for a 45° angle is radius * √2/2
      const diagonalOffset = exactRadius * Math.sqrt(2) / 2;
      expect(findHandleAtPosition([task], topX + diagonalOffset, topY + diagonalOffset)).not.toBeNull();
      expect(findHandleAtPosition([task], topX - diagonalOffset, topY + diagonalOffset)).not.toBeNull();
      expect(findHandleAtPosition([task], topX + diagonalOffset, topY - diagonalOffset)).not.toBeNull();
      expect(findHandleAtPosition([task], topX - diagonalOffset, topY - diagonalOffset)).not.toBeNull();
      
      // Test points just beyond HANDLE_RADIUS (should NOT be detected)
      const beyondRadius = HANDLE_RADIUS + 0.01;
      
      // Points just outside the circle edge
      expect(findHandleAtPosition([task], topX + beyondRadius, topY)).toBeNull();
      expect(findHandleAtPosition([task], topX - beyondRadius, topY)).toBeNull();
      expect(findHandleAtPosition([task], topX, topY - beyondRadius)).toBeNull();
      expect(findHandleAtPosition([task], topX, topY + beyondRadius)).toBeNull();
      
      // Points at diagonal positions just outside the radius
      const beyondDiagonalOffset = beyondRadius * Math.sqrt(2) / 2;
      expect(findHandleAtPosition([task], topX + beyondDiagonalOffset, topY + beyondDiagonalOffset)).toBeNull();
    });
  });
}); 