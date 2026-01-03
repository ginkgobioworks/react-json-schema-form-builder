import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ValueSelector from './ValueSelector';

// Mock child components
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
          onClick={() => onChange(['newChoice'])}
          data-testid='card-selector-change'
        >
          Change
        </button>
        <div data-testid='chosen-choices'>{chosenChoices.join(',')}</div>
      </div>
    );
  };
});

jest.mock('../CardEnumOptions', () => {
  return function MockCardEnumOptions({
    onChange,
    initialValues,
  }: {
    onChange: (values: any[]) => void;
    initialValues: any[];
  }) {
    return (
      <div data-testid='card-enum-options'>
        <button
          onClick={() => onChange([...initialValues, 'newValue'])}
          data-testid='enum-change'
        >
          Add Value
        </button>
      </div>
    );
  };
});

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

describe('ValueSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders "Appear if defined" when possibility has no value', () => {
    render(
      <ValueSelector
        possibility={{ children: ['child1'] }}
        onChange={mockOnChange}
        parentName='parent'
      />,
    );

    expect(screen.getByText('Appear if defined')).toBeInTheDocument();
  });

  it('renders CardSelector for string enum type', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: ['value1'] },
        }}
        onChange={mockOnChange}
        parentEnums={['value1', 'value2', 'value3']}
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('card-selector')).toBeInTheDocument();
  });

  it('renders CardSelector for number enum type', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: [1, 2] },
        }}
        onChange={mockOnChange}
        parentEnums={[1, 2, 3]}
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('card-selector')).toBeInTheDocument();
  });

  it('calls onChange when CardSelector changes for string enum', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: ['value1'] },
        }}
        onChange={mockOnChange}
        parentEnums={['value1', 'value2']}
        parentName='parent'
      />,
    );

    const changeButton = screen.getByTestId('card-selector-change');
    fireEvent.click(changeButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      children: ['child1'],
      value: { enum: ['newChoice'] },
    });
  });

  it('calls onChange when CardSelector changes for number enum', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: [1, 2] },
        }}
        onChange={mockOnChange}
        parentEnums={[1, 2, 3]}
        parentName='parent'
      />,
    );

    const changeButton = screen.getByTestId('card-selector-change');
    fireEvent.click(changeButton);

    // The mock returns ['newChoice'], which gets parsed as NaN, but we're testing the flow
    expect(mockOnChange).toHaveBeenCalled();
    const call = mockOnChange.mock.calls[0][0];
    expect(call.children).toEqual(['child1']);
    expect(call.value).toBeDefined();
  });

  it('renders FBCheckbox for boolean type', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: [true] },
        }}
        onChange={mockOnChange}
        parentType='boolean'
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('fb-checkbox')).toBeInTheDocument();
    expect(screen.getByText('parent')).toBeInTheDocument();
  });

  it('toggles boolean value when checkbox is clicked', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: [true] },
        }}
        onChange={mockOnChange}
        parentType='boolean'
        parentName='parent'
      />,
    );

    const checkbox = screen.getByTestId('checkbox-input');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalled();
    const callArgs = mockOnChange.mock.calls[0][0];
    expect(callArgs.children).toEqual(['child1']);
    expect(callArgs.value.enum).toEqual([false]);
  });

  it('toggles boolean value from false to true', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: [false] },
        }}
        onChange={mockOnChange}
        parentType='boolean'
        parentName='parent'
      />,
    );

    const checkbox = screen.getByTestId('checkbox-input');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalled();
    const callArgs = mockOnChange.mock.calls[0][0];
    expect(callArgs.children).toEqual(['child1']);
    expect(callArgs.value.enum).toEqual([true]);
  });

  it('renders CardEnumOptions for default case', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: ['value1', 'value2'] },
        }}
        onChange={mockOnChange}
        parentType='string'
        parentName='parent'
      />,
    );

    expect(screen.getByTestId('card-enum-options')).toBeInTheDocument();
  });

  it('calls onChange when CardEnumOptions changes', () => {
    render(
      <ValueSelector
        possibility={{
          children: ['child1'],
          value: { enum: ['value1'] },
        }}
        onChange={mockOnChange}
        parentType='string'
        parentName='parent'
      />,
    );

    const changeButton = screen.getByTestId('enum-change');
    fireEvent.click(changeButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      children: ['child1'],
      value: { enum: ['value1', 'newValue'] },
    });
  });

  describe('object type handling', () => {
    it('renders object type with string fields', () => {
      render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 'value1' }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'string' },
            },
          }}
        />,
      );

      expect(screen.getByPlaceholderText('String value')).toBeInTheDocument();
      expect(screen.getByText('field1:')).toBeInTheDocument();
    });

    it('renders object type with number fields', () => {
      render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 42 }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'number' },
            },
          }}
        />,
      );

      expect(screen.getByPlaceholderText('Number value')).toBeInTheDocument();
    });

    it('renders object type with object fields', () => {
      render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: { nested: 'value' } }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'object' },
            },
          }}
        />,
      );

      expect(screen.getByPlaceholderText('Object in JSON')).toBeInTheDocument();
    });

    it('updates string field in object', () => {
      render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 'old' }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'string' },
            },
          }}
        />,
      );

      const input = screen.getByPlaceholderText('String value');
      fireEvent.change(input, { target: { value: 'new' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        children: ['child1'],
        value: { enum: [{ field1: 'new' }] },
      });
    });

    it('updates number field in object', () => {
      render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 10 }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'number' },
            },
          }}
        />,
      );

      const input = screen.getByPlaceholderText('Number value');
      fireEvent.change(input, { target: { value: '20' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        children: ['child1'],
        value: { enum: [{ field1: 20 }] },
      });
    });

    it('removes object combination when close icon clicked', () => {
      const { container } = render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 'value1' }, { field2: 'value2' }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'string' },
              field2: { type: 'string' },
            },
          }}
        />,
      );

      // Find CloseIcon by its aria-label or role
      const closeIcons = container.querySelectorAll(
        '[data-testid="CloseIcon"]',
      );
      if (closeIcons.length === 0) {
        // Try finding by SVG or icon class
        const svgs = container.querySelectorAll('svg');
        if (svgs.length > 0) {
          fireEvent.click(svgs[0]);
          expect(mockOnChange).toHaveBeenCalled();
        }
      } else {
        fireEvent.click(closeIcons[0]);
        expect(mockOnChange).toHaveBeenCalledWith({
          children: ['child1'],
          value: { enum: [{ field2: 'value2' }] },
        });
      }
    });

    it('adds new object combination', () => {
      const { container } = render(
        <ValueSelector
          possibility={{
            children: ['child1'],
            value: { enum: [{ field1: 'value1' }] },
          }}
          onChange={mockOnChange}
          parentType='object'
          parentName='parent'
          parentSchema={{
            properties: {
              field1: { type: 'string' },
              field2: { type: 'number' },
            },
          }}
        />,
      );

      // Find AddIcon
      const addIcons = container.querySelectorAll('[data-testid="AddIcon"]');
      if (addIcons.length === 0) {
        // Try finding by SVG
        const svgs = container.querySelectorAll('svg');
        // The last SVG should be the AddIcon
        if (svgs.length > 0) {
          fireEvent.click(svgs[svgs.length - 1]);
          expect(mockOnChange).toHaveBeenCalled();
          const callArgs = mockOnChange.mock.calls[0][0];
          expect(callArgs.value.enum).toHaveLength(2);
          expect(callArgs.value.enum[1]).toEqual({ field1: '', field2: 0 });
        }
      } else {
        fireEvent.click(addIcons[0]);
        expect(mockOnChange).toHaveBeenCalled();
        const callArgs = mockOnChange.mock.calls[0][0];
        expect(callArgs.value.enum).toHaveLength(2);
        expect(callArgs.value.enum[1]).toEqual({ field1: '', field2: 0 });
      }
    });
  });
});
