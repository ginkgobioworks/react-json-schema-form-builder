import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FBCheckbox from './FBCheckbox';

describe('FBCheckbox', () => {
  const mockOnChangeValue = jest.fn();

  beforeEach(() => {
    mockOnChangeValue.mockClear();
  });

  it('renders with label', () => {
    render(
      <FBCheckbox
        onChangeValue={mockOnChangeValue}
        isChecked={false}
        label='Test Checkbox'
      />,
    );

    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
  });

  it('calls onChangeValue when clicked', () => {
    render(
      <FBCheckbox
        onChangeValue={mockOnChangeValue}
        isChecked={false}
        label='Test Checkbox'
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChangeValue).toHaveBeenCalledTimes(1);
  });

  it('does not call onChangeValue when disabled', () => {
    render(
      <FBCheckbox
        onChangeValue={mockOnChangeValue}
        isChecked={false}
        label='Test Checkbox'
        disabled={true}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);

    expect(mockOnChangeValue).not.toHaveBeenCalled();
  });

  it('renders checked state correctly', () => {
    render(
      <FBCheckbox
        onChangeValue={mockOnChangeValue}
        isChecked={true}
        label='Test Checkbox'
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('uses dataTest prop for data-testid', () => {
    render(
      <FBCheckbox
        onChangeValue={mockOnChangeValue}
        isChecked={false}
        label='Test Checkbox'
        dataTest='custom-test-id'
      />,
    );

    const checkbox = screen.getByTestId('custom-test-id');
    expect(checkbox).toBeInTheDocument();
  });
});
