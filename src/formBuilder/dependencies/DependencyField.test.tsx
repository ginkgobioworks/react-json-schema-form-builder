import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DependencyField from './DependencyField';

// Mock child components
jest.mock('./DependencyWarning', () => {
  return function MockDependencyWarning({}: { parameters: any }) {
    return <div data-testid='dependency-warning'>Warning</div>;
  };
});

jest.mock('./DependencyPossibility', () => {
  return function MockDependencyPossibility({
    possibility,
    onChange,
    onDelete,
  }: {
    possibility: any;
    onChange: (p: any) => void;
    onDelete: () => void;
  }) {
    return (
      <div data-testid='dependency-possibility'>
        <button
          onClick={() => onChange({ ...possibility, children: ['newChild'] })}
          data-testid='change-possibility'
        >
          Change
        </button>
        <button onClick={onDelete} data-testid='delete-possibility'>
          Delete
        </button>
      </div>
    );
  };
});

jest.mock('../radio/FBRadioGroup', () => {
  return function MockFBRadioGroup({
    onChange,
  }: {
    onChange: (value: string) => void;
    defaultValue: string;
  }) {
    return (
      <div data-testid='radio-group'>
        <button onClick={() => onChange('value')} data-testid='select-value'>
          Value
        </button>
        <button
          onClick={() => onChange('definition')}
          data-testid='select-definition'
        >
          Definition
        </button>
      </div>
    );
  };
});

describe('DependencyField', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with no dependents', () => {
    render(
      <DependencyField parameters={{ name: 'test' }} onChange={mockOnChange} />,
    );

    expect(screen.getByText(/Dependencies/)).toBeInTheDocument();
    expect(screen.getByTestId('dependency-warning')).toBeInTheDocument();
  });

  it('renders radio group when dependents exist', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'] }],
        }}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
  });

  it('renders dependency possibilities', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'] }, { children: ['child2'] }],
        }}
        onChange={mockOnChange}
      />,
    );

    const possibilities = screen.getAllByTestId('dependency-possibility');
    expect(possibilities).toHaveLength(2);
  });

  it('handles adding new dependency', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [],
        }}
        onChange={mockOnChange}
      />,
    );

    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [{ children: [], value: undefined }],
    });
  });

  it('handles adding dependency with value-based type', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'], value: { enum: ['val1'] } }],
        }}
        onChange={mockOnChange}
      />,
    );

    // Find the add button (IconButton with AddIcon)
    const buttons = screen.getAllByRole('button');
    const addButton = buttons[buttons.length - 1]; // Last button is the add button
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [
        { children: ['child1'], value: { enum: ['val1'] } },
        { children: [], value: { enum: [] } },
      ],
    });
  });

  it('handles dependency possibility onChange', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'] }],
        }}
        onChange={mockOnChange}
      />,
    );

    const changeButton = screen.getByTestId('change-possibility');
    fireEvent.click(changeButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [{ children: ['newChild'] }],
    });
  });

  it('handles dependency possibility onDelete', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'] }, { children: ['child2'] }],
        }}
        onChange={mockOnChange}
      />,
    );

    const deleteButtons = screen.getAllByTestId('delete-possibility');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [{ children: ['child2'] }],
    });
  });

  it('handles radio group onChange to definition', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'], value: { enum: ['val1'] } }],
        }}
        onChange={mockOnChange}
      />,
    );

    const definitionButton = screen.getByTestId('select-definition');
    fireEvent.click(definitionButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [{ children: ['child1'], value: undefined }],
    });
  });

  it('handles radio group onChange to value', () => {
    render(
      <DependencyField
        parameters={{
          name: 'test',
          dependents: [{ children: ['child1'] }],
        }}
        onChange={mockOnChange}
      />,
    );

    const valueButton = screen.getByTestId('select-value');
    fireEvent.click(valueButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      dependents: [{ children: ['child1'], value: { enum: [] } }],
    });
  });
});
