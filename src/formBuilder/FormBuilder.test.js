import React from 'react';
import { mount } from 'enzyme';
import FormBuilder from './FormBuilder';

// mocks to record events
const mockEvent = jest.fn(() => {});

const props = {
  schema: '',
  uischema: '',
  onChange: (newSchema, newUiSchema) => mockEvent(newSchema, newUiSchema),
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
  uiSchema: '',
  onChange: (newSchema, newUiSchema) => mockEvent(newSchema, newUiSchema),
};

describe('FormBuilder', () => {
  it('renders without error', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    expect(wrapper.exists('.form-body')).toBeTruthy();
    expect(wrapper.exists('[data-test="form-head"]')).toBeTruthy();
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
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...modProps} />, { attachTo: div });
    expect(wrapper.find('.form-body').first().find('.collapse').length).toEqual(
      3,
    );
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
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...modProps} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
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
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...modProps} />, { attachTo: div });
    const blocks = wrapper
      .find('.collapse')
      .map((block) => block.find('.card-text').first().props().value);

    expect(blocks).toEqual(['obj1', 'obj3', 'obj2']);
  });

  it('adds to the schema when hitting the add card button', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const plusButton = wrapper.find('.fa-square-plus').first();
    plusButton.simulate('click');
    const createButton = wrapper.find('button').at(1);
    expect(mockEvent).toHaveBeenCalledTimes(0);
    createButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(1);

    mockEvent.mockClear();
  });

  it('renders custom labels in the form head', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(
      <FormBuilder
        {...props}
        mods={{
          labels: {
            formNameLabel: 'test name label',
            formDescriptionLabel: 'test description label',
          },
        }}
      />,
      { attachTo: div },
    );
    expect(wrapper.find('[data-test="form-name-label"]').text()).toEqual(
      'test name label',
    );
    expect(wrapper.find('[data-test="form-description-label"]').text()).toEqual(
      'test description label',
    );
  });

  it('does not render the form head if showFormHead is false', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(
      <FormBuilder {...props} mods={{ showFormHead: false }} />,
      { attachTo: div },
    );
    expect(wrapper.exists('.form-body')).toBeTruthy();
    expect(wrapper.exists('[data-test="form-head"]')).toBeFalsy();
  });

  it('renders $refs with custom titles and descriptions', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...propsWithDefinitions} />, {
      attachTo: div,
    });

    expect(wrapper.exists('.form-body')).toBeTruthy();

    const cardInputs = wrapper.find('.card-container').first().find('input');
    expect(cardInputs.at(1).props().value).toEqual('Custom Title');
    expect(cardInputs.at(2).props().value).toEqual('Custom Description');
  });

  it('supports the $schema keyword and there is no error', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
    };

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
  });

  it('supports the meta keyword and there is no error', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      meta: {
        some: 'meta information',
      },
    };

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
  });

  it('supports column size', () => {
    const jsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      meta: {
        some: 'meta information',
      },
    };

    const uischema = {
      newInput1: {
        'ui:column': 4,
      },
      'ui:order': ['newInput1'],
    };

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
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

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
  });

  it('validates additionalProperties as a valid property', () => {
    const jsonSchema = {
      $schema: `http://json-schema.org/draft-07/schema#`,
      properties: {},
      required: [],
      additionalProperties: false,
    };

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: '{}',
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
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

    const props = {
      schema: JSON.stringify(jsonSchema),
      uiSchema: JSON.stringify(uischema),
      onChange: jest.fn(() => {}),
      mods: {},
      className: 'my-form-builder',
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    const errors = wrapper
      .find('.alert-warning')
      .first()
      .find('li')
      .map((error) => error.text());
    expect(errors).toEqual([]);
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
      uiSchema: JSON.stringify(uiSchema),
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...innerProps} />, { attachTo: div });

    const sectionHeadInputs = wrapper
      .find('.section-container')
      .first()
      .find('.section-head')
      .first()
      .find('input');

    const titleInput = sectionHeadInputs.at(2);

    titleInput.simulate('change', {
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
      uiSchema: JSON.stringify(uiSchema),
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...innerProps} />, { attachTo: div });

    const sectionHeadInputs = wrapper
      .find('.section-container')
      .first()
      .find('.section-head')
      .first()
      .find('input');

    const titleInput = sectionHeadInputs.at(3);

    titleInput.simulate('change', {
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
    let jsonSchema = {
      properties: {
        newInput1: {
          title: 'New Input 1',
          type: 'string',
        },
      },
    };

    let uiSchema = {
      'ui:order': ['newInput1'],
      newInput1: {
        'ui:column': '3',
      },
    };

    const innerProps = {
      ...props,

      schema: JSON.stringify(jsonSchema),
      uischema: JSON.stringify(uiSchema),
      onChange: (newSchema, newUiSchema) => {
        jsonSchema = newSchema;
        uiSchema = newUiSchema;
      },
    };

    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...innerProps} />, { attachTo: div });
    const cardInputs = wrapper.find('.card-container').first().find('input');

    cardInputs.at(0).simulate('blur', {
      target: { value: 'nameA' },
    });

    const expected = {
      'ui:order': ['nameA'],
      nameA: {
        'ui:column': '3',
      },
    };

    expect(JSON.parse(uiSchema)).toEqual(expected);
    mockEvent.mockClear();
  });
});
