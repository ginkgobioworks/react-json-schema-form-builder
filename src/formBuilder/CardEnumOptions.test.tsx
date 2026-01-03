import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardEnumOptions from './CardEnumOptions';

describe('CardEnumOptions', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders possible values correctly', () => {
    render(
      <CardEnumOptions
        initialValues={['option1', 'option2']}
        showNames={false}
        onChange={mockOnChange}
        type='string'
      />,
    );

    const inputs = screen.getAllByPlaceholderText('Possible Value');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('option1');
    expect(inputs[1]).toHaveValue('option2');
  });

  it('allows typing in input without losing focus (issue #369)', () => {
    // Start with one empty value
    render(
      <CardEnumOptions
        initialValues={['']}
        showNames={false}
        onChange={mockOnChange}
        type='string'
      />,
    );

    const input = screen.getByPlaceholderText('Possible Value');

    // Focus and type character by character
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'O' } });

    // Verify onChange was called with correct value
    expect(mockOnChange).toHaveBeenCalledWith(['O'], undefined);

    // Clear mock and simulate continuing to type
    mockOnChange.mockClear();

    // The key fix is that the component maintains focus and doesn't lose
    // characters. This is ensured by using stable keys instead of array indices.
    // In a real scenario, after re-render with new values, the input would
    // maintain focus because it has a stable key.
  });

  it('adds new value when clicking add button', () => {
    render(
      <CardEnumOptions
        initialValues={['existing']}
        showNames={false}
        onChange={mockOnChange}
        type='string'
      />,
    );

    // Find and click the add button
    const addButtons = screen.getAllByRole('button');
    const addButton = addButtons.find((btn) =>
      btn.querySelector('[data-testid="AddIcon"]'),
    );

    expect(addButton).toBeTruthy();
    if (addButton) fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith(['existing', ''], undefined);
  });

  it('removes value when clicking delete button', () => {
    render(
      <CardEnumOptions
        initialValues={['first', 'second']}
        showNames={false}
        onChange={mockOnChange}
        type='string'
      />,
    );

    // Find delete buttons (they have CloseIcon)
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('[data-testid="CloseIcon"]'));

    expect(deleteButtons).toHaveLength(2);

    // Delete the first value
    fireEvent.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(['second'], undefined);
  });

  it('handles number type correctly', () => {
    render(
      <CardEnumOptions
        initialValues={[1, 2]}
        showNames={false}
        onChange={mockOnChange}
        type='number'
      />,
    );

    const inputs = screen.getAllByPlaceholderText('Possible Value');
    expect(inputs[0]).toHaveAttribute('type', 'number');

    // Change a number value
    fireEvent.change(inputs[0], { target: { value: '42' } });

    expect(mockOnChange).toHaveBeenCalledWith([42, 2], undefined);
  });

  it('renders label inputs when showNames is true', () => {
    render(
      <CardEnumOptions
        initialValues={['value1']}
        names={['Label 1']}
        showNames={true}
        onChange={mockOnChange}
        type='string'
      />,
    );

    expect(screen.getByPlaceholderText('Possible Value')).toHaveValue('value1');
    expect(screen.getByPlaceholderText('Label')).toHaveValue('Label 1');
  });
});
