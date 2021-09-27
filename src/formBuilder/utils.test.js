import { mount } from 'enzyme';
import React from 'react';
import Card from './Card';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import Section from './Section';
import {
  addCardObj,
  addSectionObj,
  checkForUnsupportedFeatures,
  DEFAULT_INPUT_NAME,
  excludeKeys,
  generateCategoryHash,
  generateElementComponentsFromSchemas,
  generateElementPropsFromSchemas,
  generateSchemaFromElementProps,
  generateUiSchemaFromElementProps,
  getCardCategory,
  getNewElementDefaultDataOptions,
  getRandomId,
  parse,
  stringify,
  subtractArray,
} from './utils';

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

function generateSchemaWithUnnamedProperties(amount) {
  const properties = [...Array(10).keys()].reduce((acc, id) => {
    return { ...acc, [`${DEFAULT_INPUT_NAME}${id + 1}`]: { type: 'string' } };
  }, {});

  return {
    $id: 'https://example.com/person.schema.json',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Test',
    type: 'object',
    properties: properties,
  };
}

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

  it('gives no warnings for the inclusion of $schema and meta keywords', () => {
    let testSchema = {
      type: 'object',
      $schema: 'http://json-schema.org/draft-07/schema#',
      meta: {
        some: 'meta information',
      },
    };
    let testUischema = {};
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

  it('generates an array of card objects with titles that remain the same for dependency updates', () => {
    const dependencySchema = {
      type: 'object',
      properties: {
        parentFirstNames: {
          $ref: '#/definitions/firstNames',
          title: 'Parent First Names',
          description: '',
        },
      },
      dependencies: {
        parentFirstNames: {
          properties: {
            childFirstNames: {
              $ref: '#/definitions/firstNames',
              title: 'Child First Names',
              description: '',
            },
          },
          required: [],
        },
      },
      definitions: {
        first_names: {
          title: 'First Names',
          type: 'string',
        },
      },
      required: [],
    };

    const dependencyUiSchema = {
      'ui:order': ['parentFirstNames', 'childFirstNames'],
    };

    const cardObjArr = generateElementPropsFromSchemas({
      schema: dependencySchema,
      uischema: dependencyUiSchema,
      categoryHash: generateCategoryHash(DEFAULT_FORM_INPUTS),
      allFormInputs: DEFAULT_FORM_INPUTS,
    });
    expect(cardObjArr).toHaveLength(2);

    //check that the dependency element's title remains the same.
    expect(cardObjArr[1].dataOptions.title).toEqual('Child First Names');
    //check that the dependency element's title is not the definition's title.
    expect(cardObjArr[1].dataOptions.title).not.toEqual('First Names');
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

  it('throws an exception if propType is invalid', () => {
    expect(() =>
      generateSchemaFromElementProps(
        [
          {
            name: 'card3',
            required: true,
            dataOptions: { type: 'boolean' },
            uiOptions: { 'ui:widget': 'boolean' },
            propType: 'foobar',
          },
        ],
        DEFAULT_FORM_INPUTS,
      ),
    ).toThrow(new Error('Element that is neither card, section, nor ref'));
  });

  it('generates schema from element with schema prop', () => {
    const expectedSchemaElement = {
      $ref: '#/definitions/someDefinition',
      title: 'Input Field',
      description: 'This is an example description',
    };

    const result = generateSchemaFromElementProps(
      [
        {
          name: 'exampleCard',
          required: true,
          $ref: '#/definitions/someDefinition',
          schema: {
            description: 'This is an example description',
            title: 'Input Field',
          },
          propType: 'card',
        },
      ],
      DEFAULT_FORM_INPUTS,
    );

    expect(result.properties.exampleCard).toEqual(expectedSchemaElement);
  });

  it('generates schema from element with dataOptions prop', () => {
    const expectedSchemaElement = {
      $ref: '#/definitions/someDefinition',
      title: 'Input Field',
      description: 'This is an example description',
    };

    const result = generateSchemaFromElementProps(
      [
        {
          name: 'exampleCard',
          required: true,
          $ref: '#/definitions/someDefinition',
          dataOptions: {
            description: 'This is an example description',
            title: 'Input Field',
          },
          propType: 'card',
        },
      ],
      DEFAULT_FORM_INPUTS,
    );

    expect(result.properties.exampleCard).toEqual(expectedSchemaElement);
  });

  it('generates the correct JSON Schema from a compound element with the required prop', () => {
    const expectedSchemaElement = {
      $ref: '#/definitions/someDefinition',
      title: 'Input Field',
      description: 'This is an example description',
      required: ['field_one'],
    };

    const result = generateSchemaFromElementProps(
      [
        {
          name: 'exampleCard',
          required: true,
          $ref: '#/definitions/someDefinition',
          dataOptions: {
            description: 'This is an example description',
            title: 'Input Field',
          },
          schema: {
            required: ['field_one'],
          },
          propType: 'card',
        },
      ],
      DEFAULT_FORM_INPUTS,
    );

    expect(result.properties.exampleCard).toEqual(expectedSchemaElement);
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

describe('subtractArray', () => {
  it('returns the first array if the second array is undefined', () => {
    const array1 = ['a', 'b', 'f'];
    const array2 = undefined;

    const expectedResult = ['a', 'b', 'f'];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array if both arrays are empty', () => {
    const array1 = [];
    const array2 = [];

    const expectedResult = [];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array if both arrays are identical', () => {
    const array1 = ['a', 'b', 'c'];
    const array2 = ['a', 'b', 'c'];

    const expectedResult = [];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array if both arrays have the same elements', () => {
    const array1 = ['c', 'a', 'b', 'd'];
    const array2 = ['a', 'b', 'c', 'd'];

    const expectedResult = [];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an array equal to array1 if array2 is empty', () => {
    const array1 = ['c', 'a', 'b', 'd'];
    const array2 = [];

    const expectedResult = ['c', 'a', 'b', 'd'];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array if array1 is empty', () => {
    const array1 = [];
    const array2 = ['a', 'b', 'c'];

    const expectedResult = [];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns array1 without the elements in array2', () => {
    const array1 = ['a', 'b', 'c', 'd', 'e'];
    const array2 = ['a', 'b', 'c'];

    const expectedResult = ['d', 'e'];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns array1 without the elements in array2 even if array2 contains elements not included in array1', () => {
    const array1 = ['a', 'b', 'c', 'd', 'e'];
    const array2 = ['a', 'b', 'c', 'f', 'g'];

    const expectedResult = ['d', 'e'];
    const actualResult = subtractArray(array1, array2);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('excludeKeys', () => {
  it('returns the given object excluding the given keys', () => {
    const obj = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const keys = ['biz', 'boo', 'extraKey'];

    const expectedResult = { foo: 'bar', bla: 'bee' };
    const actualResult = excludeKeys(obj, keys);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns the given object if keys is empty', () => {
    const obj = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const keys = [];

    const expectedResult = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const actualResult = excludeKeys(obj, keys);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns the given object if keys is undefined', () => {
    const obj = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const keys = undefined;

    const expectedResult = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const actualResult = excludeKeys(obj, keys);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns the given object if keys is null', () => {
    const obj = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const keys = null;

    const expectedResult = { foo: 'bar', biz: 'baz', boo: 'baa', bla: 'bee' };
    const actualResult = excludeKeys(obj, keys);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty object if both obj and keys are empty', () => {
    const obj = {};
    const keys = [];

    const expectedResult = {};
    const actualResult = excludeKeys(obj, keys);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('getNewElementDefaultDataOptions', () => {
  it('returns a default dataOptions when undefined mods are passed', () => {
    const i = 1;
    const mods = undefined;
    const expectedDataOptions = {
      title: 'New Input 1',
      type: 'string',
      default: '',
    };

    const actualDataOptions = getNewElementDefaultDataOptions(i, mods);

    expect(actualDataOptions).toEqual(expectedDataOptions);
  });

  it('returns a title containing the index', () => {
    const i = 146;
    const mods = undefined;
    const expectedDataOptions = {
      title: 'New Input 146',
      type: 'string',
      default: '',
    };

    const actualDataOptions = getNewElementDefaultDataOptions(i, mods);

    expect(actualDataOptions).toEqual(expectedDataOptions);
  });

  it('returns a default dataOptions when mods without newElementDefaultDataOptions are passed', () => {
    const i = 1;
    const mods = {
      labels: {
        formNameLabel: 'Form Title',
      },
    };
    const expectedDataOptions = {
      title: 'New Input 1',
      type: 'string',
      default: '',
    };

    const actualDataOptions = getNewElementDefaultDataOptions(i, mods);

    expect(actualDataOptions).toEqual(expectedDataOptions);
  });

  it('returns dataOptions with a $ref when mods with newElementDefaultDataOptions are passed', () => {
    const i = 1;
    const mods = {
      newElementDefaultDataOptions: {
        title: 'Input Field',
        $ref: '#/definitions/someDefinition',
      },
    };
    const expectedDataOptions = {
      title: 'Input Field 1',
      $ref: '#/definitions/someDefinition',
    };

    const actualDataOptions = getNewElementDefaultDataOptions(i, mods);

    expect(actualDataOptions).toEqual(expectedDataOptions);
  });

  it('returns dataOptions with another kind of field when mods with newElementDefaultDataOptions are passed', () => {
    const i = 1;
    const mods = {
      newElementDefaultDataOptions: {
        title: 'Input',
        type: 'number',
        default: 1,
        minimum: 1,
        maximum: 10,
      },
    };
    const expectedDataOptions = {
      title: 'Input 1',
      type: 'number',
      default: 1,
      minimum: 1,
      maximum: 10,
    };

    const actualDataOptions = getNewElementDefaultDataOptions(i, mods);

    expect(actualDataOptions).toEqual(expectedDataOptions);
  });
});

describe('addCardObj', () => {
  it('should be able to add more than 10 unnamed CardObj', () => {
    const mockEvent = jest.fn(() => {});
    const defaultUiSchema = {};
    const props = {
      schema: generateSchemaWithUnnamedProperties(10),
      uischema: defaultUiSchema,
      onChange: (schema, uischema) => mockEvent(schema, uischema),
      definitionData: {},
      definitionUi: {},
      categoryHash: {},
    };

    addCardObj(props);

    const currentSchema = mockEvent.mock.calls[0][0];
    const inputElementsCount = Object.keys(currentSchema.properties).length;

    expect(inputElementsCount).toEqual(11);
  });
});

describe('addSectionObj', () => {
  it('should be able to add more than 10 unnamed SectionObj', () => {
    const mockEvent = jest.fn(() => {});
    const defaultUiSchema = {};
    const props = {
      schema: generateSchemaWithUnnamedProperties(10),
      uischema: defaultUiSchema,
      onChange: (schema, uischema) => mockEvent(schema, uischema),
      definitionData: {},
      definitionUi: {},
      categoryHash: {},
    };

    addSectionObj(props);

    const currentSchema = mockEvent.mock.calls[0][0];
    const inputElementsCount = Object.keys(currentSchema.properties).length;

    expect(inputElementsCount).toEqual(11);
  });
});

describe('getRandomId', () => {
  it('should return string of length 50 of random lower case letters', () => {
    expect(getRandomId()).toMatch(/^[a-z]{50}$/);
  });
});
