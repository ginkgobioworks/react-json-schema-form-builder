import React from 'react';
import { mount } from 'enzyme';
import Card from './Card';
import Section from './Section';
import {
  parse,
  stringify,
  getCardCategory,
  checkForUnsupportedFeatures,
  generateElementPropsFromSchemas,
  generateSchemaFromElementProps,
  generateUiSchemaFromElementProps,
  generateCategoryHash,
  generateElementComponentsFromSchemas,
} from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';

const schema = {
  type: 'object',
  properties: {
    obj1: {
      enum: [0, 1, 2, 3, 4],
      title: 'testName',
    },
    obj2: {
      type: 'number',
      title: 'testName2',
    },
    obj3: {
      type: 'string',
      minLength: 5,
    },
  },
};

const uischema = {
  obj1: {
    'ui:widget': 'radio',
  },
  'ui:order': ['obj2', 'obj3', 'obj1'],
};

const elementPropArr = [
  {
    name: 'card1',
    dataOptions: {
      type: 'string',
    },
    required: true,
    uiOptions: {},
    propType: 'card',
  },
  {
    name: 'card2',
    dataOptions: {
      type: 'number',
      multipleOf: 2,
    },
    required: false,
    uiOptions: { 'ui:widget': 'number' },
    propType: 'card',
  },
  {
    name: 'card3',
    required: true,
    dataOptions: { type: 'boolean' },
    uiOptions: { 'ui:widget': 'boolean' },
    propType: 'card',
  },
];

describe('parse', () => {
  it('parses valid JSON into a JS object', () => {
    expect(
      parse(
        `
    {
      "key": {
        "array": ["item1", "item2"], 
        "name": "obj1", 
        "num": 0
      }
    }`,
        'json',
      ),
    ).toEqual({ key: { array: ['item1', 'item2'], name: 'obj1', num: 0 } });
  });
  it('parses empty JSON into an empty JS object', () => {
    expect(parse('', 'json')).toEqual({});
  });
});

describe('stringify', () => {
  it('turns an object into validly formatted JSON', () => {
    expect(
      stringify(
        { key: { array: ['item1', 'item2'], name: 'obj1', num: 0 } },
        'json',
      ),
    ).toEqual('{"key":{"array":["item1","item2"],"name":"obj1","num":0}}');
  });
});

describe('getCardCategory', () => {
  it('returns the correct category for cards without ui refinements', () => {
    let card = {
      dataOptions: {
        type: 'string',
      },
      uiOptions: {},
      propType: 'card',
    };
    const categoryHash = generateCategoryHash(DEFAULT_FORM_INPUTS);
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'shortAnswer',
    );
    card = {
      dataOptions: {
        type: 'integer',
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'integer',
    );
    card = {
      dataOptions: {
        type: 'number',
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'number',
    );
    card = {
      dataOptions: {
        type: 'boolean',
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'checkbox',
    );
    card = {
      dataOptions: {
        type: 'array',
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'array',
    );
    card = {
      dataOptions: {
        enum: [0, 1, 2, 3, 4, 5],
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'dropdown',
    );
  });
  it('returns the correct category for cards with ui refinements', () => {
    let card = {
      dataOptions: {
        type: 'string',
      },
      uiOptions: {
        'ui:widget': 'password',
      },
      propType: 'card',
    };
    const categoryHash = generateCategoryHash(DEFAULT_FORM_INPUTS);
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'password',
    );
    card = {
      dataOptions: {
        enum: [0, 1, 2, 3, 4, 5],
      },
      uiOptions: {
        'ui:widget': 'radio',
      },
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'radio',
    );
    card = {
      dataOptions: {
        type: 'array',
      },
      uiOptions: {},
      propType: 'card',
    };
    expect(getCardCategory(card, categoryHash, DEFAULT_FORM_INPUTS)).toEqual(
      'array',
    );
  });
});

describe('checkForUnsupportedFeatures', () => {
  it('gives no warnings for various valid combinations', () => {
    let testSchema = {
      type: 'object',
    };
    let testUischema = {};
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual([]);
    testSchema = {
      type: 'object',
      properties: {
        obj1: {
          type: 'string',
        },
        obj2: {
          type: 'string',
        },
      },
    };
    testUischema = {
      'ui:order': ['obj1', 'obj2'],
    };
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual([]);
  });

  it('gives warnings for unknown features in schema', () => {
    let testSchema = {
      type: 'object',
    };
    let testUischema = {};
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual([]);
    testSchema = {
      type: 'object',
      erroneousKey: 'val',
      properties: {
        obj1: {
          type: 'string',
        },
        obj2: {
          type: 'number',
        },
      },
      dependencies: {
        a: {
          type: 'string',
        },
        b: {
          type: 'string',
        },
      },
    };
    testUischema = {
      'ui:order': ['obj1', 'obj2'],
    };
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual(['Unrecognized Object Property: erroneousKey']);
  });
  it('gives warnings for unknown features in ui schema', () => {
    let testSchema = {
      type: 'object',
    };
    let testUischema = {};
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual([]);
    testSchema = {
      type: 'object',
      properties: {
        obj1: {
          type: 'string',
        },
        obj2: {
          type: 'number',
        },
      },
    };
    testUischema = {
      'ui:order': ['obj1', 'obj2'],
      'ui:error': {
        asdf: 'asdf',
      },
      obj1: {
        'ui:widget': 'password',
        'ui:error2': 'err',
      },
    };
    expect(
      checkForUnsupportedFeatures(
        testSchema,
        testUischema,
        DEFAULT_FORM_INPUTS,
      ),
    ).toEqual([
      'Unrecognized UI schema property: ui:error',
      'UI Property: ui:error2 for obj1',
    ]);
  });
});

describe('generateElementPropsFromSchemas', () => {
  it('generates an array of card objects from a schema and ui schema', () => {
    const cardObjArr = generateElementPropsFromSchemas({
      schema,
      uischema,
      categoryHash: generateCategoryHash(DEFAULT_FORM_INPUTS),
      allFormInputs: DEFAULT_FORM_INPUTS,
    });
    expect(cardObjArr).toHaveLength(3);

    // see if reading properties from data schema
    expect(cardObjArr[0].dataOptions.title).toEqual('testName2');

    // see if reading type specific properties from data schema
    expect(cardObjArr[1].dataOptions.minLength).toEqual(5);

    // check if reading the ui schema
    expect(cardObjArr[2].uiOptions['ui:widget']).toEqual('radio');

    // check if order is correct
    expect(cardObjArr[0].name).toEqual('obj2');
    expect(cardObjArr[1].name).toEqual('obj3');
    expect(cardObjArr[2].name).toEqual('obj1');
  });
});

describe('generateSchemaFromElementProps', () => {
  const schemaProps = generateSchemaFromElementProps(
    elementPropArr,
    DEFAULT_FORM_INPUTS,
  );

  it('generates a schema representation of properties from card object array', () => {
    expect(schemaProps.properties).toEqual({
      card1: { type: 'string' },
      card2: { multipleOf: 2, type: 'number' },
      card3: { type: 'boolean' },
    });

    expect(schemaProps.required).toEqual(['card1', 'card3']);
  });
});

describe('generateUiSchemaFromElementProps', () => {
  const uiSchema = generateUiSchemaFromElementProps(
    elementPropArr,
    DEFAULT_FORM_INPUTS,
  );
  it('generates a ui schema representation from card object array', () => {
    expect(uiSchema).toEqual({
      card2: { 'ui:widget': 'number' },
      card3: { 'ui:widget': 'boolean' },
      'ui:order': ['card1', 'card2', 'card3'],
    });
  });
});

describe('generateElementComponentsFromSchemas', () => {
  it('propagates mods to Section component', () => {
    const MockComponent = jest.fn(() => <div />);
    const mods = {
      customFormInputs: {
        test: {
          displayName: 'Test',
          matchIf: [
            {
              types: ['number'],
              widget: 'test',
            },
          ],
          defaultDataSchema: {},
          defaultUiSchema: { 'ui:widget': 'test' },
          type: 'number',
          cardBody: MockComponent,
        },
      },
    };
    const allFormInputs = {
      ...DEFAULT_FORM_INPUTS,
      ...mods.customFormInputs,
    };
    const categoryHash = generateCategoryHash(allFormInputs);

    const TestComponent = () => (
      <React.Fragment>
        {generateElementComponentsFromSchemas({
          schemaData: {
            type: 'object',
            properties: {
              section1: {
                title: 'Section 1',
                type: 'object',
                properties: {
                  newInput1: {
                    items: {
                      type: 'number',
                    },
                    title: 'New Input 1',
                    type: 'array',
                  },
                },
                dependencies: {},
                required: [],
              },
            },
            dependencies: {},
            required: [],
          },
          uiSchemaData: {
            section1: {
              newInput1: {
                items: {
                  'ui:widget': 'test',
                },
              },
              'ui:order': ['newInput1'],
            },
            'ui:order': ['section1'],
          },
          onChange: () => {},
          path: '',
          cardOpenArray: [true],
          setCardOpenArray: () => {},
          allFormInputs,
          mods,
          categoryHash,
          Card,
          Section,
        })}
      </React.Fragment>
    );
    const div = document.createElement('div');
    document.body.appendChild(div);
    mount(<TestComponent />, { attachTo: div });
    expect(MockComponent.mock.calls[0][0].mods).toEqual(mods);
  });
});
