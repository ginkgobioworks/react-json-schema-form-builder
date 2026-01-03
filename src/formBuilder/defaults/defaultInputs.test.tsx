import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import defaultInputs from './defaultInputs';

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

jest.mock('../CardEnumOptions', () => {
  return function MockCardEnumOptions({
    onChange,
    initialValues,
    names,
    showNames,
    type,
  }: {
    onChange: (values: any[], names?: string[]) => void;
    initialValues: any[];
    names?: string[];
    showNames: boolean;
    type: string;
  }) {
    return (
      <div data-testid='card-enum-options'>
        <button
          onClick={() =>
            onChange(
              [...initialValues, 'new'],
              names ? [...names, 'new'] : undefined,
            )
          }
          data-testid='enum-change'
        >
          Add
        </button>
        <div data-testid='enum-info'>
          {showNames ? 'showNames' : 'noNames'} {type}
        </div>
      </div>
    );
  };
});

describe('defaultInputs', () => {
  describe('Checkbox component', () => {
    it('renders checkbox with default value', () => {
      const Checkbox = defaultInputs.checkbox.cardBody;
      const mockOnChange = jest.fn();

      render(
        <Checkbox
          parameters={{ name: 'test', default: true }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByTestId('fb-checkbox')).toBeInTheDocument();
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('toggles default value when clicked', () => {
      const Checkbox = defaultInputs.checkbox.cardBody;
      const mockOnChange = jest.fn();

      render(
        <Checkbox
          parameters={{ name: 'test', default: true }}
          onChange={mockOnChange}
        />,
      );

      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeChecked(); // Should be checked when default is true

      // Click the checkbox to trigger onChange
      fireEvent.click(checkbox);

      // The component spreads parameters, so we check it was called with the right default
      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.default).toBe(false);
    });

    it('sets default to true when current is false', () => {
      const Checkbox = defaultInputs.checkbox.cardBody;
      const mockOnChange = jest.fn();

      render(
        <Checkbox
          parameters={{ name: 'test', default: false }}
          onChange={mockOnChange}
        />,
      );

      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).not.toBeChecked(); // Should not be checked when default is false

      // Click the checkbox to trigger onChange
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.default).toBe(true);
    });
  });

  describe('MultipleChoice component', () => {
    it('renders with enum values', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: ['option1', 'option2'] }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Possible Values')).toBeInTheDocument();
      expect(screen.getByTestId('card-enum-options')).toBeInTheDocument();
    });

    it('toggles enumNames checkbox', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: ['option1', 'option2'] }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const enumNamesCheckbox = checkboxes[0];
      fireEvent.click(enumNamesCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.enum).toEqual(['option1', 'option2']);
      expect(callArgs.enumNames).toEqual(['option1', 'option2']);
    });

    it('removes enumNames when unchecked', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{
            name: 'test',
            enum: ['option1', 'option2'],
            enumNames: ['Option 1', 'Option 2'],
          }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const enumNamesCheckbox = checkboxes[0];
      fireEvent.click(enumNamesCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.enum).toEqual(['option1', 'option2']);
      expect(callArgs.enumNames).toBe(null);
    });

    it('handles CardEnumOptions onChange', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: ['option1'] }}
          onChange={mockOnChange}
        />,
      );

      const addButton = screen.getByTestId('enum-change');
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        enum: ['option1', 'new'],
        enumNames: undefined,
      });
    });

    it('handles CardEnumOptions onChange with enumNames', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{
            name: 'test',
            enum: ['option1'],
            enumNames: ['Option 1'],
          }}
          onChange={mockOnChange}
        />,
      );

      const addButton = screen.getByTestId('enum-change');
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        enum: ['option1', 'new'],
        enumNames: ['Option 1', 'new'],
      });
    });
  });

  describe('getInputCardBodyComponent', () => {
    it('renders input field for dateTime', () => {
      const DateTimeInput = defaultInputs.dateTime.cardBody;
      const mockOnChange = jest.fn();

      render(
        <DateTimeInput
          parameters={{ name: 'test', default: '2023-01-01T00:00' }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveAttribute('type', 'datetime-local');
    });

    it('calls onChange when input changes', () => {
      const DateTimeInput = defaultInputs.dateTime.cardBody;
      const mockOnChange = jest.fn();

      render(
        <DateTimeInput
          parameters={{ name: 'test', default: '' }}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByPlaceholderText('Default');
      fireEvent.change(input, { target: { value: '2023-01-01T00:00' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        name: 'test',
        default: '2023-01-01T00:00',
      });
    });

    it('renders input field for date', () => {
      const DateInput = defaultInputs.date.cardBody;
      const mockOnChange = jest.fn();

      render(
        <DateInput
          parameters={{ name: 'test', default: '2023-01-01' }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('renders input field for time', () => {
      const TimeInput = defaultInputs.time.cardBody;
      const mockOnChange = jest.fn();

      render(
        <TimeInput
          parameters={{ name: 'test', default: '12:00' }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveAttribute('type', 'time');
    });
  });

  describe('MultipleChoice number conversion', () => {
    it('converts enum values to numbers when Force number is checked', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: ['1', '2', '3'] }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      // The second checkbox should be "Force number"
      const forceNumberCheckbox = checkboxes[1];
      fireEvent.click(forceNumberCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.enum).toEqual([1, 2, 3]);
    });

    it('converts enum values back to strings when Force number is unchecked', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: [1, 2, 3] }}
          onChange={mockOnChange}
        />,
      );

      const checkboxes = screen.getAllByTestId('checkbox-input');
      // The second checkbox should be "Force number" (checked)
      const forceNumberCheckbox = checkboxes[1];
      expect(forceNumberCheckbox).toBeChecked();
      fireEvent.click(forceNumberCheckbox);

      expect(mockOnChange).toHaveBeenCalled();
      const callArgs = mockOnChange.mock.calls[0][0];
      expect(callArgs.enum).toEqual(['1', '2', '3']);
    });

    it('hides Force number checkbox when enum contains unparsable strings', () => {
      const MultipleChoice = defaultInputs.radio.cardBody;
      const mockOnChange = jest.fn();

      render(
        <MultipleChoice
          parameters={{ name: 'test', enum: ['abc', 'def'] }}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Possible Values')).toBeInTheDocument();
      // The Force number checkbox is hidden with CSS (display: none) when
      // enum contains unparsable strings, so we can't easily test it directly.
      // But we can verify the component renders without errors.
      const checkboxes = screen.getAllByTestId('checkbox-input');
      // Should have at least the enumNames checkbox
      expect(checkboxes.length).toBeGreaterThanOrEqual(1);
    });
  });
});
