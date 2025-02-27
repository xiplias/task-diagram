import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock the TaskDiagram component to avoid canvas issues
vi.mock('./TaskDiagram', () => ({
  default: () => <div data-testid="task-diagram-mock">TaskDiagram Mock</div>
}));

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Task Dependency Diagram')).toBeInTheDocument();
  });

  it('renders the TaskDiagram component', () => {
    render(<App />);
    expect(screen.getByTestId('task-diagram-mock')).toBeInTheDocument();
  });
}); 