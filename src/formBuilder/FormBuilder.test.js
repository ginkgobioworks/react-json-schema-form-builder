import React from 'react';
import { mount } from 'enzyme';

import FormBuilder from './FormBuilder';

// mocks to record events
const mockEvent = jest.fn(() => {});

const props = {
  schema: '',
  uischema: '',
  onChange: (newSchema, newUiSchema) => mockEvent(newSchema, newUiSchema),
  lang: 'yaml',
};

describe('FormBuilder', () => {
  it('renders without error', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...props} />, { attachTo: div });
    expect(wrapper.exists('.form-body')).toBeTruthy();
  });

  it('renders the appropriate number of cards', () => {
    const modProps = {
      ...props,
      schema: `
        type: object
        properties:
            obj1: 
                type: string
            obj2:
                type: number
            obj3:
                type: boolean
        `,
    };
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<FormBuilder {...modProps} />, { attachTo: div });
    expect(wrapper.find('.form-body').first().find('.collapse').length).toEqual(
      3
    );
  });

  it('generates warning messages', () => {
    const modProps = {
      ...props,
      schema: `
        type: object
        properties:
            obj1: 
                type: string
            obj2:
                type: number
                badSideProp: asdf
            obj3:
                type: boolean
        `,
      uischema: `
        'ui:order':
            - obj1
            - obj3
            - obj2
        invalidUiProp: asdf
        `,
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
        type: object
        properties:
            obj1: 
                type: string
                title: obj1
            obj2:
                type: number
                badSideProp: asdf
                title: obj2
            obj3:
                type: boolean
                title: obj3
        `,
      uischema: `
        'ui:order':
            - obj1
            - obj3
            - obj2
        invalidUiProp: asdf
        `,
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
    const plusButton = wrapper.find('.fa-plus-square').first();
    plusButton.simulate('click');
    const createButton = wrapper.find('button').at(1);
    expect(mockEvent).toHaveBeenCalledTimes(0);
    createButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(1);
    mockEvent.mockClear();
  });
});
