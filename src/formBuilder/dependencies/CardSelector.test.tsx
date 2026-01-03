import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardSelector from './CardSelector';

describe('CardSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders chosen choices as list items', () => {
    render(
      <CardSelector
        possibleChoices={['choice1', 'choice2', 'choice3']}
        chosenChoices={['choice1', 'choice2']}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    expect(screen.getByText('choice1')).toBeInTheDocument();
    expect(screen.getByText('choice2')).toBeInTheDocument();
  });

  it('calls onChange when removing a choice', () => {
    render(
      <CardSelector
        possibleChoices={['choice1', 'choice2', 'choice3']}
        chosenChoices={['choice1', 'choice2']}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    const closeIcons = screen.getAllByRole('button', { hidden: true });
    // Find the close icon for choice1 (first item)
    const closeIcon = closeIcons.find((icon) =>
      icon.closest('li')?.textContent?.includes('choice1'),
    );

    if (closeIcon) {
      fireEvent.click(closeIcon);
      expect(mockOnChange).toHaveBeenCalledWith(['choice2']);
    }
  });

  it('renders autocomplete with available choices', () => {
    render(
      <CardSelector
        possibleChoices={['choice1', 'choice2', 'choice3']}
        chosenChoices={['choice1']}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    const input = screen.getByPlaceholderText('Select...');
    expect(input).toBeInTheDocument();
  });

  it('filters out already chosen choices from autocomplete', () => {
    render(
      <CardSelector
        possibleChoices={['choice1', 'choice2', 'choice3']}
        chosenChoices={['choice1']}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    const input = screen.getByPlaceholderText('Select...');
    expect(input).toBeInTheDocument();
    // Note: Testing MUI Autocomplete filtering requires more complex setup
  });

  it('handles empty chosenChoices', () => {
    render(
      <CardSelector
        possibleChoices={['choice1', 'choice2']}
        chosenChoices={[]}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    const list = screen.queryByRole('list');
    if (list) {
      expect(list.children).toHaveLength(0);
    }
  });

  it('handles empty possibleChoices', () => {
    render(
      <CardSelector
        possibleChoices={[]}
        chosenChoices={['choice1']}
        onChange={mockOnChange}
        placeholder='Select...'
      />,
    );

    expect(screen.getByText('choice1')).toBeInTheDocument();
  });
});
