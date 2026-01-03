import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';

import Card from './Card';

// mocks to record events
const mockEvent = jest.fn();

const params = {
  name: 'test',
  category: 'shortAnswer',
  neighborNames: ['test', 'input2'],
};

const props = {
  componentProps: params,
  onChange: (newVals: unknown) => mockEvent(JSON.stringify(newVals)),
  onDelete: () => mockEvent('delete'),
  onMoveUp: () => mockEvent('moveUp'),
  onMoveDown: () => mockEvent('moveDown'),
  setCardOpen: () => mockEvent,
  cardOpen: false,
  TypeSpecificParameters: ({
    parameters,
    onChange,
  }: {
    parameters: { name: string; inputVal?: string };
    onChange: (params: { name: string; inputVal?: string }) => void;
  }) => (
    <input
      data-testid='inputVal'
      value={(parameters as any).inputVal || ''}
      onChange={(val) => {
        onChange({
          ...parameters,
          inputVal: val.target.value,
        });
      }}
    />
  ),
  allFormInputs: DEFAULT_FORM_INPUTS,
};

const mods = {
  labels: {
    objectNameLabel: 'Custom Object Name',
    displayNameLabel: 'Custom Display Name',
    descriptionLabel: 'Custom Description',
    inputTypeLabel: 'Custom Input Type',
  },
};

describe('Card', () => {
  it('renders without error', () => {
    render(<Card {...props} />);
    // Card container should be present
    expect(screen.getByTestId('card-container')).toBeInTheDocument();
  });

  it('calls the delete function on delete', () => {
    render(<Card {...props} cardOpen={true} />);
    // Find delete button by its tooltip/accessible name
    const deleteButton = screen.getByRole('button', {
      name: /delete form element/i,
    });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('delete');
    mockEvent.mockClear();
  });

  it('calls the move up and move down functions on arrow presses', () => {
    render(<Card {...props} />);
    const moveUpButton = screen.getByRole('button', {
      name: /move form element up/i,
    });
    const moveDownButton = screen.getByRole('button', {
      name: /move form element down/i,
    });

    expect(moveUpButton).toBeInTheDocument();
    fireEvent.click(moveUpButton);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('moveUp');

    expect(moveDownButton).toBeInTheDocument();
    fireEvent.click(moveDownButton);
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent).toHaveBeenCalledWith('moveDown');
    mockEvent.mockClear();
  });

  it('opens up the modal on pencil press', () => {
    render(<Card {...props} cardOpen={true} />);
    const editButton = screen.getByRole('button', {
      name: /additional configurations/i,
    });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(screen.getByTestId('card-modal')).toBeInTheDocument();
  });

  it('changes the name when the key is altered', () => {
    render(<Card {...props} cardOpen={true} />);
    // Get the Object Name input by its placeholder
    const keyInput = screen.getByPlaceholderText('Key');

    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'wow_name_change' } });
    fireEvent.blur(keyInput);
    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'test' } });
    fireEvent.blur(keyInput);
    expect(mockEvent.mock.calls).toEqual([
      [
        '{"name":"wow_name_change","category":"shortAnswer","neighborNames":["test","input2"]}',
      ],
      [
        '{"name":"test","category":"shortAnswer","neighborNames":["test","input2"]}',
      ],
    ]);
    mockEvent.mockClear();
  });

  it('does not change the name if the name is already in use', () => {
    render(<Card {...props} cardOpen={true} />);
    const keyInput = screen.getByPlaceholderText('Key');

    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'input2' } });
    fireEvent.blur(keyInput);
    expect(mockEvent.mock.calls).toEqual([
      [
        '{"name":"test","category":"shortAnswer","neighborNames":["test","input2"]}',
      ],
    ]);
    mockEvent.mockClear();
  });

  it('calls the onChange with new values when edited', () => {
    render(<Card {...props} cardOpen={true} />);
    // Get title and description inputs by placeholder
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');

    fireEvent.change(titleInput, { target: { value: 'wow title change' } });
    fireEvent.blur(titleInput);
    fireEvent.change(descriptionInput, {
      target: { value: 'wow description change' },
    });
    fireEvent.blur(descriptionInput);
    expect(mockEvent.mock.calls).toEqual([
      [
        '{"name":"test","category":"shortAnswer","neighborNames":["test","input2"],"title":' +
          '"wow title change"}',
      ],
      [
        '{"name":"test","category":"shortAnswer","neighborNames":["test","input2"],' +
          '"description":"wow description change"}',
      ],
    ]);
    mockEvent.mockClear();
  });

  it('renders with default labels if no mods are passed', () => {
    render(<Card {...props} cardOpen={true} />);
    expect(
      screen.getByText('Object Name', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Display Name', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Description', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Input Type', { exact: false }),
    ).toBeInTheDocument();
  });

  it('renders with passed labels', () => {
    const propsWithMods = { ...props, mods: mods, cardOpen: true };
    render(<Card {...propsWithMods} />);
    expect(
      screen.getByText('Custom Object Name', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Custom Display Name', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Custom Description', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Custom Input Type', { exact: false }),
    ).toBeInTheDocument();
  });

  it('preserves description when changing input type (issue #467)', () => {
    // Start with a description set
    const paramsWithDescription = {
      ...params,
      description: 'Test description that should be preserved',
    };
    const propsWithDescription = {
      ...props,
      componentProps: paramsWithDescription,
      cardOpen: true,
    };
    render(<Card {...propsWithDescription} />);

    // Verify description is initially present
    const descriptionInput = screen.getByPlaceholderText('Description');
    expect(descriptionInput).toHaveValue(
      'Test description that should be preserved',
    );

    // Change the input type from shortAnswer to number
    // The combobox has placeholder "Input Type"
    const inputTypeCombobox = screen.getByPlaceholderText('Input Type');
    fireEvent.mouseDown(inputTypeCombobox);

    // Select Number option
    const numberOption = screen.getByRole('option', { name: 'Number' });
    fireEvent.click(numberOption);

    // Verify the onChange was called with the description preserved
    const lastCall = mockEvent.mock.calls[mockEvent.mock.calls.length - 1][0];
    const parsedCall = JSON.parse(lastCall);
    expect(parsedCall.description).toBe(
      'Test description that should be preserved',
    );
    expect(parsedCall.type).toBe('number');
    mockEvent.mockClear();
  });
});
