import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import Section from './Section';

// mocks to record events
const mockEvent = jest.fn();

const defaultSchema = {};

const defaultUiSchema = {};

const props = {
  name: 'test',
  required: false,
  schema: defaultSchema,
  uischema: defaultUiSchema,
  onChange: (schema: unknown, uischema: unknown) => mockEvent(schema, uischema),
  onNameChange: (newName: string) => mockEvent(newName),
  onRequireToggle: () => mockEvent('toggledRequire'),
  onDelete: () => mockEvent('delete'),
  onDependentsChange: () => mockEvent(),
  onMoveUp: () => mockEvent(),
  onMoveDown: () => mockEvent(),
  path: 'section',
  definitionData: {},
  definitionUi: {},
  allFormInputs: DEFAULT_FORM_INPUTS,
  parentProperties: {
    schema: {},
    uischema: {},
    onChange: mockEvent,
    definitionData: {},
    definitionUi: {},
    categoryHash: {},
  },
  cardOpen: true,
  setCardOpen: mockEvent,
  categoryHash: {},
};

describe('Section', () => {
  it('renders without error', () => {
    render(<Section {...props} />);
    expect(screen.getByTestId('section-container')).toBeInTheDocument();
  });

  it('uses mods.tooltipDescriptions', () => {
    render(
      <Section
        {...props}
        mods={{
          tooltipDescriptions: {
            cardSectionObjectName: 'test object name',
            cardSectionDisplayName: 'test display name',
            cardSectionDescription: 'test description',
          },
        }}
      />,
    );

    // Find section object name tooltip (text is in aria-label)
    const objectNameSection = screen.getByTestId('section-object-name');
    expect(
      within(objectNameSection).getByLabelText('test object name'),
    ).toBeInTheDocument();

    // Find section display name tooltip
    const displayNameSection = screen.getByTestId('section-display-name');
    expect(
      within(displayNameSection).getByLabelText('test display name'),
    ).toBeInTheDocument();

    // Find section description tooltip
    const descriptionSection = screen.getByTestId('section-description');
    expect(
      within(descriptionSection).getByLabelText('test description'),
    ).toBeInTheDocument();
  });

  it('calls the delete function on delete', () => {
    render(<Section {...props} />);
    const deleteButton = document.querySelector(
      'svg[data-testid="DeleteIcon"]',
    );
    expect(deleteButton).toBeInTheDocument();
    const deleteButtonParent = deleteButton?.closest('button');
    fireEvent.click(deleteButtonParent!);
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('delete');
    mockEvent.mockClear();
  });

  it('changes the key name of the section', () => {
    render(<Section {...props} />);
    const keyInput = document.querySelector(
      '.card-text input',
    ) as HTMLInputElement;
    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'wow_key_change' } });
    fireEvent.blur(keyInput);
    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'test' } });
    fireEvent.blur(keyInput);
    expect(mockEvent.mock.calls).toEqual([['wow_key_change'], ['test']]);
    mockEvent.mockClear();
  });

  it('changes the section title', () => {
    render(<Section {...props} />);
    const inputs = document.querySelectorAll('.card-text input');
    const titleInput = inputs[1] as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'wow title change' } });
    expect(mockEvent.mock.calls).toEqual([[{ title: 'wow title change' }, {}]]);
    mockEvent.mockClear();
  });

  it('changes the section description', () => {
    render(<Section {...props} />);
    const inputs = document.querySelectorAll('.card-text input');
    const descriptionInput = inputs[2] as HTMLInputElement;
    fireEvent.change(descriptionInput, {
      target: { value: 'wow description change' },
    });
    expect(mockEvent.mock.calls).toEqual([
      [{ description: 'wow description change' }, {}],
    ]);
    mockEvent.mockClear();
  });

  it('adds components to the internal schema', () => {
    render(<Section {...props} />);
    // Find the section by its test id and query the add button within it
    const sectionContainer = screen.getByTestId('section-container');
    expect(sectionContainer).toBeInTheDocument();
    const plusButton = within(sectionContainer).getByLabelText(
      'Create new form element',
    );
    fireEvent.click(plusButton);
    const createButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(createButton);
    expect(mockEvent.mock.calls).toEqual([
      [
        {
          properties: { newInput1: { title: 'New Input 1', type: 'string' } },
          dependencies: {},
          required: [],
          type: 'object',
        },
        { definitions: {}, newInput1: {}, 'ui:order': ['newInput1'] },
      ],
    ]);
    mockEvent.mockClear();
  });
});
