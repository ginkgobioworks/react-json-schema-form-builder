import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaceholderInput } from './PlaceholderInput';

describe('PlaceholderInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without error', () => {
    render(
      <PlaceholderInput
        parameters={{ name: 'test' }}
        onChange={mockOnChange}
        mods={{}}
      />,
    );
    expect(screen.getByText('Placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();
  });

  it('displays existing placeholder value', () => {
    render(
      <PlaceholderInput
        parameters={{
          name: 'test',
          'ui:placeholder': 'Enter your name',
        }}
        onChange={mockOnChange}
        mods={{}}
      />,
    );
    expect(screen.getByDisplayValue('Enter your name')).toBeInTheDocument();
  });

  it('calls onChange when placeholder value changes', () => {
    render(
      <PlaceholderInput
        parameters={{
          name: 'test',
          'ui:placeholder': '',
        }}
        onChange={mockOnChange}
        mods={{}}
      />,
    );

    const input = screen.getByPlaceholderText('Placeholder');
    fireEvent.change(input, { target: { value: 'New placeholder' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      'ui:placeholder': 'New placeholder',
    });
  });

  it('preserves other parameters when changing placeholder', () => {
    render(
      <PlaceholderInput
        parameters={{
          name: 'test',
          type: 'string',
          title: 'Name',
          'ui:placeholder': 'Old value',
        }}
        onChange={mockOnChange}
        mods={{}}
      />,
    );

    const input = screen.getByPlaceholderText('Placeholder');
    fireEvent.change(input, { target: { value: 'New value' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test',
      type: 'string',
      title: 'Name',
      'ui:placeholder': 'New value',
    });
  });

  it('renders help tooltip', () => {
    render(
      <PlaceholderInput
        parameters={{ name: 'test' }}
        onChange={mockOnChange}
        mods={{}}
      />,
    );
    // The tooltip icon should be in the document
    expect(screen.getByLabelText(/Hint to the user/)).toBeInTheDocument();
  });
});
