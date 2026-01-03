import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DependencyPossibility from './DependencyPossibility';

// Mock the child components
jest.mock('./CardSelector', () => {
  return function MockCardSelector({
    onChange,
    chosenChoices,
  }: {
    onChange: (choices: string[]) => void;
    chosenChoices: string[];
  }) {
    return (
      <div data-testid='card-selector'>
        <button
          onClick={() => onChange([...chosenChoices, 'newChoice'])}
          data-testid='add-choice'
        >
          Add Choice
        </button>
      </div>
    );
  };
});

jest.mock('./ValueSelector', () => {
  return function MockValueSelector({
    onChange,
  }: {
    onChange: (possibility: any) => void;
  }) {
    return (
      <div data-testid='value-selector'>
        <button
          onClick={() =>
            onChange({
              children: ['child1'],
              value: { enum: ['newValue'] },
            })
          }
          data-testid='change-value'
        >
          Change Value
        </button>
      </div>
    );
  };
});

describe('DependencyPossibility', () => {
  const mockOnChange = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders with basic possibility', () => {
    render(
      <DependencyPossibility
        possibility={{ children: ['child1'] }}
        neighborNames={['child1', 'child2', 'parent']}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        parentName='parent'
      />,
    );

    expect(screen.getByText(/Display the following:/i)).toBeInTheDocument();
    expect(screen.getByText(/If "parent" has a value./i)).toBeInTheDocument();
  });

  it('renders value selector when possibility has value', () => {
    render(
      <DependencyPossibility
        possibility={{
          children: ['child1'],
          value: { enum: ['value1'] },
        }}
        neighborNames={['child1', 'child2', 'parent']}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('value-selector')).toBeInTheDocument();
    expect(screen.getByText(/If "parent" has the value:/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <DependencyPossibility
        possibility={{ children: ['child1'] }}
        neighborNames={['child1', 'child2']}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        parentName='parent'
      />,
    );

    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('filters out parent name from neighbor names', () => {
    render(
      <DependencyPossibility
        possibility={{ children: [] }}
        neighborNames={['child1', 'child2', 'parent']}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('card-selector')).toBeInTheDocument();
  });

  it('handles value selector onChange', () => {
    render(
      <DependencyPossibility
        possibility={{
          children: ['child1'],
          value: { enum: ['value1'] },
        }}
        neighborNames={['child1', 'child2']}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        parentName='parent'
      />,
    );

    const changeValueButton = screen.getByTestId('change-value');
    fireEvent.click(changeValueButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      children: ['child1'],
      value: { enum: ['newValue'] },
    });
  });
});
