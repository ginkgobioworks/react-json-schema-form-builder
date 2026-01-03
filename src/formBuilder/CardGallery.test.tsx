import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import { generateCategoryHash } from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import CardGallery from './CardGallery';

// mocks to record events
const mockEvent = jest.fn();

const props = {
  definitionSchema: {},
  definitionUiSchema: {},
  onChange: (
    newDef: { [key: string]: unknown },
    newUiDef: { [key: string]: unknown },
  ) => mockEvent(newDef, newUiDef),
  categoryHash: generateCategoryHash(DEFAULT_FORM_INPUTS),
};

describe('CardGallery', () => {
  it('renders without error', () => {
    render(<CardGallery {...props} />);
    expect(screen.getByTestId('form-gallery')).toBeInTheDocument();
  });

  it('renders appropriate number of cards with a give definition', () => {
    const modProps = {
      ...props,
      definitionSchema: {
        obj1: {
          type: 'string',
        },
        obj2: {
          type: 'string',
        },
        obj3: {
          type: 'string',
        },
      },
    };
    render(<CardGallery {...modProps} />);
    expect(screen.getAllByTestId('form-gallery-container').length).toEqual(3);
  });

  it('adds a new object to the schema when clicking the plus button', () => {
    render(<CardGallery {...props} />);

    const plusButton = screen.getByLabelText('Create new form element');
    expect(plusButton).toBeInTheDocument();
    fireEvent.click(plusButton);
    const createButton = screen.getByRole('button', { name: 'Create' });
    expect(mockEvent).toHaveBeenCalledTimes(0);
    fireEvent.click(createButton);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    mockEvent.mockClear();
  });

  it('calls the onChange method when editing a card', () => {
    const modProps = {
      ...props,
      definitionSchema: {
        obj1: {
          type: 'string',
        },
        obj2: {
          type: 'string',
        },
        obj3: {
          type: 'string',
        },
      },
    };
    render(<CardGallery {...modProps} />);
    // Get the first card container and find the title input within it
    const containers = screen.getAllByTestId('form-gallery-container');
    const titleInput = within(containers[0]).getByPlaceholderText('Title');
    fireEvent.change(titleInput, { target: { value: 'wow many change' } });
    fireEvent.blur(titleInput);
    expect(
      (mockEvent.mock.calls[0][0] as { obj1: { title: string } }).obj1.title,
    ).toEqual('wow many change');
    mockEvent.mockClear();
  });
});
