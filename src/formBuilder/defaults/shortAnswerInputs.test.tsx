import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import shortAnswerInputs from './shortAnswerInputs';

// Mock child components
jest.mock('../FBCheckbox', () => {
  return function MockFBCheckbox({
    onChangeValue,
    isChecked,
    label,
  }: {
    onChangeValue: () => void;
    isChecked: boolean;
    label?: string;
  }) {
    return (
      <div data-testid='fb-checkbox'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={() => onChangeValue()}
          data-testid='checkbox-input'
        />
        {label && <label>{label}</label>}
      </div>
    );
  };
});

jest.mock('../PlaceholderInput', () => ({
  PlaceholderInput: function MockPlaceholderInput({
    parameters,
    onChange,
  }: {
    parameters: any;
    onChange: (params: any) => void;
  }) {
    return (
      <div data-testid='placeholder-input'>
        <input
          data-testid='placeholder-field'
          value={parameters['ui:placeholder'] || ''}
          onChange={(e) =>
            onChange({ ...parameters, 'ui:placeholder': e.target.value })
          }
        />
      </div>
    );
  },
}));

describe('shortAnswerInputs', () => {
  describe('ShortAnswerField', () => {
    it('renders default value input', () => {
      const ShortAnswerField = shortAnswerInputs.shortAnswer.cardBody;
      const mockOnChange = jest.fn();

      render(
        <ShortAnswerField
          parameters={{ name: 'test', default: 'test' }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveValue('test');
    });

    it('calls onChange when default value changes', () => {
      const ShortAnswerField = shortAnswerInputs.shortAnswer.cardBody;
      const mockOnChange = jest.fn();

      render(
        <ShortAnswerField
          parameters={{ name: 'test', default: '' }}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByPlaceholderText('Default');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        default: 'new value',
      });
    });
  });

  describe('Password', () => {
    it('renders password input', () => {
      const Password = shortAnswerInputs.password.cardBody;
      const mockOnChange = jest.fn();

      render(
        <Password
          parameters={{ name: 'test', default: 'secret' }}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveValue('secret');
    });
  });

  describe('CardShortAnswerParameterInputs', () => {
    it('renders all input fields', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      expect(screen.getByText('Minimum Length')).toBeInTheDocument();
      expect(screen.getByText('Maximum Length')).toBeInTheDocument();
      expect(
        screen.getByText(/Regular Expression Pattern/),
      ).toBeInTheDocument();
      expect(screen.getByText('Format')).toBeInTheDocument();
      expect(screen.getByText(/Auto Complete Category/)).toBeInTheDocument();
    });

    it('handles minLength change', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const minLengthInput = screen.getByPlaceholderText('Minimum Length');
      fireEvent.change(minLengthInput, { target: { value: '5' } });

      expect(mockOnChange).toHaveBeenCalledWith({ name: 'test', minLength: 5 });
    });

    it('handles maxLength change', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const maxLengthInput = screen.getByPlaceholderText('Maximum Length');
      fireEvent.change(maxLengthInput, { target: { value: '10' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        maxLength: 10,
      });
    });

    it('handles pattern change', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const patternInput = screen.getByPlaceholderText(
        'Regular Expression Pattern',
      );
      fireEvent.change(patternInput, { target: { value: '^[a-z]+$' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        pattern: '^[a-z]+$',
      });
    });

    it('handles autofocus checkbox toggle', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const autofocusCheckbox = checkboxes[checkboxes.length - 1];
      fireEvent.click(autofocusCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs['ui:autofocus']).toBe(true);
    });

    it('toggles autofocus from true to false', () => {
      const ModalBody = shortAnswerInputs.shortAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody
          parameters={{ name: 'test', 'ui:autofocus': true }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const autofocusCheckbox = checkboxes[checkboxes.length - 1];
      fireEvent.click(autofocusCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs['ui:autofocus']).toBe(false);
    });
  });
});
