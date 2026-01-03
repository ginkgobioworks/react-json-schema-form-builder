import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import FormBuilder from './FormBuilder';

// mocks to record events
const mockEvent = jest.fn();

const props = {
  schema: '',
  uischema: '',
  onChange: (newSchema: string, newUiSchema: string) =>
    mockEvent(newSchema, newUiSchema),
};

const schemaWithDefinitions = {
  type: 'object',
  definitions: {
    exampleDefinition: {
      type: 'string',
    },
  },
  properties: {
    exampleField: {
      $ref: '#/definitions/exampleDefinition',
      title: 'Custom Title',
      description: 'Custom Description',
    },
  },
};

const propsWithDefinitions = {
  schema: JSON.stringify(schemaWithDefinitions),
  uischema: '',
  onChange: (newSchema: string, newUiSchema: string) =>
    mockEvent(newSchema, newUiSchema),
};

describe('FormBuilder', () => {
  it('renders without error', () => {
    render(<FormBuilder {...props} />);
    expect(screen.getByTestId('form-body')).toBeInTheDocument();
    expect(screen.getByTestId('form-head')).toBeInTheDocument();
  });

  it('renders the appropriate number of cards', () => {
    const modProps = {
      ...props,
      schema: `{
     "type": "object",
     "properties": {
        "obj1": {
           "type": "string"
        },
        "obj2": {
           "type": "number"
        },
        "obj3": {
           "type": "boolean"
        }
     }
  }`,
    };
    render(<FormBuilder {...modProps} />);
    // Each card should be rendered
    expect(screen.getAllByTestId('card-container').length).toEqual(3);
  });

  it('generates warning messages', () => {
    const modProps = {
      ...props,
      schema: `{
     "type": "object",
     "properties": {
        "obj1": {
           "type": "string"
        },
        "obj2": {
           "type": "number",
           "badSideProp": "asdf"
        },
        "obj3": {
           "type": "boolean"
        }
     }
  }`,
      uischema: `{
     "ui:order": [
        "obj1",
        "obj3",
        "obj2"
     ],
     "invalidUiProp": "asdf"
  }`,
    };
    render(<FormBuilder {...modProps} />);
    // Look for warning alert by role
    const warningAlert = screen.getByRole('alert');
    expect(warningAlert).toBeInTheDocument();

    const listItems = within(warningAlert).getAllByRole('listitem');
    const errors = listItems.map((item) => item.textContent);
    expect(errors).toEqual([
      'Unrecognized UI schema property: invalidUiProp',
      'Property Parameter: badSideProp in obj2',
    ]);
  });

  it('renders the cards in the correct order according to ui:order', () => {
    const modProps = {
      ...props,
      schema: `
          {
     "type": "object",
     "properties": {
        "obj1": {
           "type": "string",
           "title": "obj1"
        },
        "obj2": {
           "type": "number",
           "badSideProp": "asdf",
           "title": "obj2"
        },
        "obj3": {
           "type": "boolean",
           "title": "obj3"
        }
     }
  }`,
      uischema: `
  {
     "ui:order": [
        "obj1",
        "obj3",
        "obj2"
     ],
     "invalidUiProp": "asdf"
  }`,
    };
    render(<FormBuilder {...modProps} />);
    // Find all key inputs (Object Name fields) in order
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const values = keyInputs.map((input) => (input as HTMLInputElement).value);

    expect(values).toEqual(['obj1', 'obj3', 'obj2']);
  });

  it('adds to the schema when hitting the add card button', () => {
    render(<FormBuilder {...props} />);
    const addButton = screen.getByRole('button', {
      name: /create new form element/i,
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const createButton = screen.getByRole('button', { name: 'Create' });
    expect(mockEvent).toHaveBeenCalledTimes(0);
    fireEvent.click(createButton);
    expect(mockEvent).toHaveBeenCalledTimes(1);

    mockEvent.mockClear();
  });

  it('renders custom labels in the form head', () => {
    render(
      <FormBuilder
        {...props}
        mods={{
          labels: {
            formNameLabel: 'test name label',
            formDescriptionLabel: 'test description label',
          },
        }}
      />,
    );
    expect(screen.getByTestId('form-name-label')).toHaveTextContent(
      'test name label',
    );
    expect(screen.getByTestId('form-description-label')).toHaveTextContent(
      'test description label',
    );
  });

  it('does not render the form head if showFormHead is false', () => {
    render(<FormBuilder {...props} mods={{ showFormHead: false }} />);
    expect(screen.getByTestId('form-body')).toBeInTheDocument();
    expect(screen.queryByTestId('form-head')).not.toBeInTheDocument();
  });

  it('renders $refs with custom titles and descriptions', () => {
    render(<FormBuilder {...propsWithDefinitions} />);

    expect(screen.getByTestId('form-body')).toBeInTheDocument();

    // Find the card container and query within it for title/description
    const cardContainer = screen.getByTestId('card-container');
    const titleInput = within(cardContainer).getByPlaceholderText('Title');
    const descInput = within(cardContainer).getByPlaceholderText('Description');

    // The card should have the custom title and description
    expect(titleInput).toHaveValue('Custom Title');
    expect(descInput).toHaveValue('Custom Description');
  });

  it('supports the $schema keyword and there is no error', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    // There should be no warning alert with list items
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it('supports the meta keyword and there is no error', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      meta: {
        some: 'meta information',
      },
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it('supports column size', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      meta: {
        some: 'meta information',
      },
      properties: {
        newInput1: {
          title: 'New Input 1',
          type: 'string',
        },
      },
      dependencies: {},
      required: [],
    };

    const uischema = {
      newInput1: {
        'ui:column': 4,
      },
      'ui:order': ['newInput1'],
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it('supports column size on sections', () => {
    const jsonSchema = {
      definitions: {
        first_names: {
          title: 'First Names',
          type: 'string',
        },
        last_names: {
          title: 'Last Names',
          type: 'string',
        },
        residential_address: {
          title: 'Residential Address',
          type: 'object',
          properties: {
            country: {
              title: 'Country',
              type: 'string',
            },
            street_address_line: {
              title: 'Street Address Line',
              type: 'string',
            },
          },
          dependencies: {},
          required: [],
        },
      },
      properties: {
        user_first_names: {
          $ref: '#/definitions/first_names',
          title: 'User First Names',
          description: '',
        },
        user_last_name: {
          $ref: '#/definitions/last_names',
          title: 'User Last Name',
          description: '',
        },
        user_residential_address: {
          $ref: '#/definitions/residential_address',
          title: 'User Residential Address',
          description: '',
        },
      },
      dependencies: {},
      required: [],
      type: 'object',
    };

    const uischema = {
      definitions: {
        residential_address: {
          'ui:order': ['country', 'street_address_line'],
        },
      },
      'ui:order': [
        'user_first_names',
        'user_last_name',
        'user_residential_address',
      ],
      user_first_names: {
        'ui:column': '25',
      },
      user_last_name: {
        'ui:column': '25',
      },
      user_residential_address: {
        'ui:order': ['country', 'address_line'],
        'ui:column': '50',
        country: {
          'ui:column': '30',
        },
        street_address_line: {
          'ui:column': '70',
        },
      },
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it('validates additionalProperties as a valid property', () => {
    const jsonSchema = {
      $schema: `http://json-schema.org/draft-07/schema#`,
      properties: {},
      required: [],
      additionalProperties: false,
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it('should support placeholder in the UI schema', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        input1: {
          $ref: '#/definitions/name',
          title: 'First Name',
          description: 'Please enter your first name',
        },
        input2: {
          title: 'Last Name',
          type: 'string',
        },
      },
    };

    const uischema = {
      input1: {
        'ui:placeholder': 'Reference Placeholder',
      },
      input2: {
        'ui:placeholder': 'ShortAnswer Placeholder',
      },
      'ui:order': ['input1', 'input2'],
    };

    const testProps = {
      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    render(<FormBuilder {...testProps} />);
    const alerts = screen.queryAllByRole('alert');
    const listsInAlerts = alerts.flatMap((alert) =>
      within(alert).queryAllByRole('listitem'),
    );
    expect(listsInAlerts).toHaveLength(0);
  });

  it("should allow changing of Section's Display Name", () => {
    const uiSchema = {
      definitions: {
        full_names: {
          'ui:order': ['first_names', 'last_names'],
        },
      },
      user_full_names: {
        'ui:order': ['first_names', 'last_names'],
      },
      'ui:order': ['user_full_names'],
    };

    const jsonSchema = {
      definitions: {
        full_names: {
          title: 'Full Names',
          type: 'object',
          description: 'This is a composite field',
          properties: {
            first_names: {
              title: 'First Names',
              type: 'string',
            },
            last_names: {
              title: 'Last Names',
              type: 'string',
            },
          },
          dependencies: {},
          required: [],
        },
      },
      properties: {
        user_full_names: {
          $ref: '#/definitions/full_names',
          title: 'User Full Names',
          description: 'Full names description',
        },
      },
      dependencies: {},
      required: [],
      type: 'object',
    };

    const innerProps = {
      ...props,
      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uiSchema),
    };

    render(<FormBuilder {...innerProps} />);

    // Find the section by its test id and query within it
    const sectionContainer = screen.getByTestId('section-container');
    const titleInput =
      within(sectionContainer).getAllByPlaceholderText('Title')[0];

    expect(titleInput).toBeInTheDocument();
    fireEvent.change(titleInput, {
      target: {
        value: 'new title change',
      },
    });

    const updatedSchema = JSON.parse(mockEvent.mock.calls[0][0]);

    expect(updatedSchema.properties.user_full_names.title).toEqual(
      'new title change',
    );
    mockEvent.mockClear();
  });

  it("should allow changing of a Section's Description", () => {
    const uiSchema = {
      definitions: {
        full_names: {
          'ui:order': ['first_names', 'last_names'],
        },
      },
      user_full_names: {
        'ui:order': ['first_names', 'last_names'],
      },
      'ui:order': ['user_full_names'],
    };

    const jsonSchema = {
      definitions: {
        full_names: {
          title: 'Full Names',
          type: 'object',
          description: 'This is a composite field',
          properties: {
            first_names: {
              title: 'First Names',
              type: 'string',
            },
            last_names: {
              title: 'Last Names',
              type: 'string',
            },
          },
          dependencies: {},
          required: [],
        },
      },
      properties: {
        user_full_names: {
          $ref: '#/definitions/full_names',
          title: 'User Full Names',
          description: 'Full names description',
        },
      },
      dependencies: {},
      required: [],
      type: 'object',
    };

    const innerProps = {
      ...props,
      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uiSchema),
    };

    render(<FormBuilder {...innerProps} />);

    // Find section by its test id and query within it
    const sectionContainer = screen.getByTestId('section-container');
    const descriptionInput =
      within(sectionContainer).getAllByPlaceholderText('Description')[0];

    expect(descriptionInput).toBeInTheDocument();
    fireEvent.change(descriptionInput, {
      target: {
        value: 'new description change',
      },
    });

    const updatedSchema = JSON.parse(mockEvent.mock.calls[0][0]);

    expect(updatedSchema.properties.user_full_names.description).toEqual(
      'new description change',
    );
    mockEvent.mockClear();
  });

  it('should edit card slug and override ui:schema with updated slug', () => {
    let jsonSchema: { [key: string]: unknown } = {
      properties: {
        newInput1: {
          title: 'New Input 1',
          type: 'string',
        },
      },
    };

    const uiSchema = {
      'ui:order': ['newInput1'],
      newInput1: {
        'ui:column': '3',
      },
    };

    let uiSchemaString = '';
    const innerProps = {
      ...props,

      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uiSchema),
      onChange: (newSchema: string, newUiSchema: string) => {
        jsonSchema = JSON.parse(newSchema);
        uiSchemaString = newUiSchema;
      },
    };

    render(<FormBuilder {...innerProps} />);
    const keyInput = screen.getByPlaceholderText('Key');

    fireEvent.blur(keyInput, {
      target: { value: 'nameA' },
    });

    const expected = {
      'ui:order': ['nameA'],
      nameA: {
        'ui:column': '3',
      },
    };

    expect(JSON.parse(uiSchemaString)).toEqual(expected);
    mockEvent.mockClear();
  });
});
