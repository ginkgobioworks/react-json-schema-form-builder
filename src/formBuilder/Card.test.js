import React from 'react';
import { mount } from 'enzyme';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';

import Card from './Card';

// mocks to record events
const mockEvent = jest.fn(() => {});

const params = {
  name: 'test',
  category: 'shortAnswer',
};

const props = {
  componentProps: params,
  onChange: (newVals) => mockEvent(JSON.stringify(newVals)),
  onDelete: () => mockEvent('delete'),
  onMoveUp: () => mockEvent('moveUp'),
  onMoveDown: () => mockEvent('moveDown'),
  TypeSpecificParameters: ({ parameters, onChange }) => (
    <input
      className='inputVal'
      value={parameters.inputVal || ''}
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

const getHeadingText = (wrapper, index) => {
  return wrapper.find('.card-container').first().find('h5').at(index).html();
};

describe('Card', () => {
  it('renders without error', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    expect(wrapper.exists('.card-container')).toBeTruthy();
  });

  it('calls the delete function on delete', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    const deleteButton = wrapper
      .find('.card-container')
      .first()
      .find('.fa-trash')
      .first();
    deleteButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('delete');
    mockEvent.mockClear();
  });

  it('calls the move up and move down functions on arrow presses', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    const moveUp = wrapper
      .find('.card-container')
      .first()
      .find('.fa-arrow-up')
      .first();
    moveUp.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('moveUp');

    const moveDown = wrapper
      .find('.card-container')
      .first()
      .find('.fa-arrow-down')
      .first();
    moveDown.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent).toHaveBeenCalledWith('moveDown');
    mockEvent.mockClear();
  });

  it('opens up the modal on pencil press', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    const pencil = wrapper
      .find('.card-container')
      .first()
      .find('.fa-pencil-alt')
      .first();
    pencil.simulate('click');
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();
  });

  it('changes the name when the key is altered', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    const key = wrapper
      .find('.card-container')
      .first()
      .find('.card-text')
      .at(1);
    key.simulate('focus');
    key.simulate('change', { target: { value: 'wow_name_change' } });
    key.simulate('blur');
    key.simulate('focus');
    key.simulate('change', { target: { value: 'test' } });
    key.simulate('blur');
    expect(mockEvent.mock.calls).toEqual([
      ['{"name":"wow_name_change","category":"shortAnswer"}'],
      ['{"name":"test","category":"shortAnswer"}'],
    ]);
    mockEvent.mockClear();
  });

  it('calls the onChange with new values when edited', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });
    const title = wrapper
      .find('.card-container')
      .first()
      .find('.card-text')
      .at(2);
    title.simulate('change', { target: { value: 'wow title change' } });
    title.simulate('blur');
    const description = wrapper
      .find('.card-container')
      .first()
      .find('.card-text')
      .at(4);
    description.simulate('change', {
      target: { value: 'wow description change' },
    });
    description.simulate('blur');
    expect(mockEvent.mock.calls).toEqual([
      ['{"name":"test","category":"shortAnswer","title":"wow title change"}'],
      [
        '{"name":"test","category":"shortAnswer","description":"wow description change"}',
      ],
    ]);
    mockEvent.mockClear();
  });

  it('renders with default labels if no mods are passed', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Card {...props} />, { attachTo: div });

    const objectNameLabel = getHeadingText(wrapper, 0);
    expect(objectNameLabel).toContain('Object Name');

    const displayNameLabel = getHeadingText(wrapper, 1);
    expect(displayNameLabel).toContain('Display Name');

    const descriptionLabel = getHeadingText(wrapper, 2);
    expect(descriptionLabel).toContain('Description');

    const inputTypeLabel = getHeadingText(wrapper, 3);
    expect(inputTypeLabel).toContain('Input Type');
  });

  it('renders with passed labels', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const propsWithMods = { ...props, mods: mods };
    const wrapper = mount(<Card {...propsWithMods} />, { attachTo: div });

    const objectNameLabel = getHeadingText(wrapper, 0);
    expect(objectNameLabel).toContain('Custom Object Name');

    const displayNameLabel = getHeadingText(wrapper, 1);
    expect(displayNameLabel).toContain('Custom Display Name');

    const descriptionLabel = getHeadingText(wrapper, 2);
    expect(descriptionLabel).toContain('Custom Description');

    const inputTypeLabel = getHeadingText(wrapper, 3);
    expect(inputTypeLabel).toContain('Custom Input Type');
  });
});
