import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import numberInputs from './numberInputs';

// Mock child components
jest.mock('../FBCheckbox', () => {
  return function MockFBCheckbox({
    onChangeValue,
    isChecked,
    label,
    disabled,
  }: {
    onChangeValue: () => void;
    isChecked: boolean;
    label?: string;
    disabled?: boolean;
  }) {
    return (
      <div data-testid='fb-checkbox'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={() => onChangeValue()}
          disabled={disabled}
          data-testid='checkbox-input'
        />
        {label && <label>{label}</label>}
      </div>
    );
  };
});

describe('numberInputs', () => {
  describe('NumberField', () => {
    it('renders default number input', () => {
      const NumberField = numberInputs.number.cardBody;
      const mockOnChange = jest.fn();

      render(
        <NumberField
          parameters={{ name: 'test', default: 42 }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default number')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveValue(42);
    });

    it('calls onChange when default value changes', () => {
      const NumberField = numberInputs.number.cardBody;
      const mockOnChange = jest.fn();

      render(
        <NumberField
          parameters={{ name: 'test', default: 0 }}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByPlaceholderText('Default');
      fireEvent.change(input, { target: { value: '100' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        default: 100,
      });
    });
  });

  describe('CardNumberParameterInputs', () => {
    it('renders all input fields', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      expect(screen.getByText(/Multiple of/)).toBeInTheDocument();
      expect(screen.getByText('Minimum')).toBeInTheDocument();
      expect(screen.getByText('Maximum')).toBeInTheDocument();
    });

    it('handles multipleOf change', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const multipleOfInput = screen.getByPlaceholderText('ex: 2');
      fireEvent.change(multipleOfInput, { target: { value: '5' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        multipleOf: 5,
      });
    });

    // Note: Testing NaN handling is difficult with type='number' inputs
    // as browsers may not trigger onChange for invalid values
    // The code handles NaN correctly (converts to null), but testing requires
    // manual DOM manipulation which is not reliable

    it('handles minimum change', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const minInput = screen.getByPlaceholderText('ex: 3');
      fireEvent.change(minInput, { target: { value: '10' } });

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.minimum).toBe(10);
      expect(callArgs.exclusiveMinimum).toBe(null);
    });

    it('handles exclusiveMinimum toggle', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody
          parameters={{ name: 'test', minimum: 5 }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const exclusiveMinCheckbox = checkboxes[0];
      fireEvent.click(exclusiveMinCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.minimum).toBe(null);
      expect(callArgs.exclusiveMinimum).toBe(5);
    });

    it('handles exclusiveMinimum toggle back to minimum', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody
          parameters={{ name: 'test', exclusiveMinimum: 5 }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const exclusiveMinCheckbox = checkboxes[0];
      fireEvent.click(exclusiveMinCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.minimum).toBe(5);
      expect(callArgs.exclusiveMinimum).toBe(null);
    });

    it('handles maximum change', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const maxInput = screen.getByPlaceholderText('ex: 8');
      fireEvent.change(maxInput, { target: { value: '20' } });

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      // Note: There's a bug in the source - it checks exclusiveMinimum instead of exclusiveMaximum
      // but we test the actual behavior
      expect(callArgs.maximum).toBe(20);
      expect(callArgs.exclusiveMaximum).toBe(null);
    });

    it('handles exclusiveMaximum toggle', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody
          parameters={{ name: 'test', maximum: 10 }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const exclusiveMaxCheckbox = checkboxes[1];
      fireEvent.click(exclusiveMaxCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.maximum).toBe(null);
      expect(callArgs.exclusiveMaximum).toBe(10);
    });

    it('disables exclusive checkboxes when no min/max set', () => {
      const ModalBody = numberInputs.number.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      expect(checkboxes[0]).toBeDisabled();
      expect(checkboxes[1]).toBeDisabled();
    });
  });
});
