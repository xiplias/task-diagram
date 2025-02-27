import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskStorage } from '../useTaskStorage';

describe('useTaskStorage Hook', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  };
  
  // Mock dispatch function
  const mockDispatch = vi.fn();
  
  beforeEach(() => {
    // Setup localStorage mock before each test
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    // Clear mocks after each test
    vi.clearAllMocks();
  });
  
  it('should save tasks and dependencies to localStorage', () => {
    const tasks = [{ id: 'task1', name: 'Task 1', x: 100, y: 100 }];
    const dependencies = [{ from: 'task1', to: 'task2' }];
    
    renderHook(() => useTaskStorage(tasks, dependencies, mockDispatch));
    
    // Check if localStorage.setItem was called with the right data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'taskDiagramData',
      JSON.stringify({ tasks, dependencies })
    );
  });
  
  it('should load saved data from localStorage on initialization', () => {
    // Mock saved data in localStorage
    const savedData = {
      tasks: [{ id: 'task1', name: 'Task 1', x: 100, y: 100 }],
      dependencies: [{ from: 'task1', to: 'task2' }]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));
    
    renderHook(() => useTaskStorage([], [], mockDispatch));
    
    // Check if data was loaded from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('taskDiagramData');
    
    // Check if dispatch was called for each task and dependency
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_TASK',
      id: 'task1',
      name: 'Task 1',
      x: 100,
      y: 100
    });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_DEPENDENCY',
      from: 'task1',
      to: 'task2'
    });
  });
  
  it('should not dispatch actions when localStorage data is invalid', () => {
    // Mock invalid JSON in localStorage
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    renderHook(() => useTaskStorage([], [], mockDispatch));
    
    // Dispatch should not be called
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  
  it('should not dispatch actions when localStorage data is missing required fields', () => {
    // Mock data without tasks or dependencies
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ otherData: true }));
    
    renderHook(() => useTaskStorage([], [], mockDispatch));
    
    // Dispatch should not be called
    expect(mockDispatch).not.toHaveBeenCalled();
  });
}); 