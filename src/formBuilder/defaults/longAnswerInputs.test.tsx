import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import longAnswerInputs from './longAnswerInputs';

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

describe('longAnswerInputs', () => {
  describe('LongAnswer', () => {
    it('renders default value textarea', () => {
      const LongAnswer = longAnswerInputs.longAnswer.cardBody;
      const mockOnChange = jest.fn();

      render(
        <LongAnswer
          parameters={{ name: 'test', default: 'long text' }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
      const textarea = screen.getByPlaceholderText('Default');
      expect(textarea).toHaveValue('long text');
    });

    it('calls onChange when default value changes', () => {
      const LongAnswer = longAnswerInputs.longAnswer.cardBody;
      const mockOnChange = jest.fn();

      render(
        <LongAnswer
          parameters={{ name: 'test', default: '' }}
          onChange={mockOnChange}
        />,
      );

      const textarea = screen.getByPlaceholderText('Default');
      fireEvent.change(textarea, { target: { value: 'new long text' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        default: 'new long text',
      });
    });
  });

  describe('CardLongAnswerParameterInputs', () => {
    it('renders all input fields', () => {
      const ModalBody = longAnswerInputs.longAnswer.modalBody;
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
    });

    it('handles minLength change', () => {
      const ModalBody = longAnswerInputs.longAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const minLengthInput = screen.getByPlaceholderText('Minimum Length');
      fireEvent.change(minLengthInput, { target: { value: '10' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        minLength: 10,
      });
    });

    it('handles maxLength change', () => {
      const ModalBody = longAnswerInputs.longAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const maxLengthInput = screen.getByPlaceholderText('Maximum Length');
      fireEvent.change(maxLengthInput, { target: { value: '500' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        maxLength: 500,
      });
    });

    it('handles pattern change', () => {
      const ModalBody = longAnswerInputs.longAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const patternInput = screen.getByPlaceholderText(
        'Regular Expression Pattern',
      );
      fireEvent.change(patternInput, { target: { value: '^[A-Z].*' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        pattern: '^[A-Z].*',
      });
    });

    it('handles autofocus checkbox toggle', () => {
      const ModalBody = longAnswerInputs.longAnswer.modalBody;
      if (!ModalBody) throw new Error('ModalBody is undefined');
      const mockOnChange = jest.fn();

      render(
        <ModalBody parameters={{ name: 'test' }} onChange={mockOnChange} />,
      );

      const checkbox = screen.getByTestId('checkbox-input');
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs['ui:autofocus']).toBe(true);
    });
  });
});
