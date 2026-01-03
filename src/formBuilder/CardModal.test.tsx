import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CardModal from './CardModal';

// mocks to record events
const mockEvent = jest.fn();

const params = {
  name: 'test',
};

const props = {
  componentProps: params,
  onChange: (newParams: unknown) => mockEvent(JSON.stringify(newParams)),
  isOpen: true,
  onClose: () => mockEvent('close'),
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
};

describe('CardModal', () => {
  it('renders without error', () => {
    render(<CardModal {...props} />);
    expect(screen.getByTestId('card-modal')).toBeInTheDocument();
  });

  it('calls the close function on cancel', () => {
    render(<CardModal {...props} />);
    expect(screen.getByTestId('card-modal')).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('close');
    mockEvent.mockClear();
  });

  it('calls the change and close functions on save', () => {
    render(<CardModal {...props} />);
    expect(screen.getByTestId('card-modal')).toBeInTheDocument();
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent.mock.calls).toEqual([['close'], ['{"name":"test"}']]);
    mockEvent.mockClear();
  });

  it('calls the onChange with a new minimum length when minimum length is altered', () => {
    render(<CardModal {...props} />);
    expect(screen.getByTestId('card-modal')).toBeInTheDocument();

    const specificField = screen.getByTestId('inputVal');
    fireEvent.change(specificField, { target: { value: 'wow many change' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent.mock.calls).toEqual([
      ['close'],
      ['{"name":"test","inputVal":"wow many change"}'],
    ]);

    mockEvent.mockClear();
  });
});
