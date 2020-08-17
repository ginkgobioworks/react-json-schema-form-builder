import React from 'react';
import { mount } from 'enzyme';
import { generateCategoryHash } from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import CardGallery from './CardGallery';

// mocks to record events
const mockEvent = jest.fn(() => {});

const props = {
  definitionSchema: {},
  definitionUiSchema: {},
  onChange: (newDef, newUiDef) => mockEvent(newDef, newUiDef),
  categoryHash: generateCategoryHash(DEFAULT_FORM_INPUTS),
};

describe('CardGallery', () => {
  it('renders without error', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<CardGallery {...props} />, { attachTo: div });
    expect(wrapper.exists('.form_gallery')).toBeTruthy();
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
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<CardGallery {...modProps} />, { attachTo: div });
    expect(wrapper.find('.form_gallery_container').length).toEqual(3);
  });

  it('adds a new object to the schema when clicking the plus button', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<CardGallery {...props} />, { attachTo: div });

    const plusButton = wrapper.find('.fa-plus-square').first();
    plusButton.simulate('click');
    const createButton = wrapper.find('button').at(1);
    expect(mockEvent).toHaveBeenCalledTimes(0);
    createButton.simulate('click');
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
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<CardGallery {...modProps} />, { attachTo: div });
    const titleField1 = wrapper
      .find('.form_gallery_container')
      .first()
      .find('.card-text')
      .at(2);
    titleField1.simulate('change', { target: { value: 'wow many change' } });
    titleField1.simulate('blur');
    expect(mockEvent.mock.calls[0][0].obj1.title).toEqual('wow many change');
    mockEvent.mockClear();
  });
});
