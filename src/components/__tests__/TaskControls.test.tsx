import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskControls from '../TaskDiagram/TaskControls';
import '@testing-library/jest-dom';

describe('TaskControls Component', () => {
  it('renders add and delete buttons', () => {
    render(<TaskControls onAddTask={() => {}} onDeleteTask={() => {}} selectedTask={null} />);
    
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });
  
  it('disables delete button when no task is selected', () => {
    render(
      <TaskControls 
        onAddTask={() => {}} 
        onDeleteTask={() => {}} 
        selectedTask={null}
      />
    );
    
    const deleteButton = screen.getByText('Delete Task');
    expect(deleteButton).toBeDisabled();
  });
  
  it('enables delete button when a task is selected', () => {
    render(
      <TaskControls 
        onAddTask={() => {}} 
        onDeleteTask={() => {}} 
        selectedTask="task1"
      />
    );
    
    const deleteButton = screen.getByText('Delete Task');
    expect(deleteButton).not.toBeDisabled();
  });
  
  it('calls onAddTask when add button is clicked', () => {
    const mockOnAddTask = vi.fn();
    
    render(
      <TaskControls 
        onAddTask={mockOnAddTask} 
        onDeleteTask={() => {}}
        selectedTask={null}
      />
    );
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    expect(mockOnAddTask).toHaveBeenCalled();
  });
  
  it('calls onDeleteTask when delete button is clicked and task is selected', () => {
    const mockOnDeleteTask = vi.fn();
    
    render(
      <TaskControls 
        onAddTask={() => {}} 
        onDeleteTask={mockOnDeleteTask} 
        selectedTask="task1"
      />
    );
    
    const deleteButton = screen.getByText('Delete Task');
    fireEvent.click(deleteButton);
    
    // Verify handler was called
    expect(mockOnDeleteTask).toHaveBeenCalled();
  });
}); 