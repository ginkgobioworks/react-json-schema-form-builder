import React from 'react';
import { mount } from 'enzyme';
import { stringify } from './utils';

import CardModal from './CardModal';

// mocks to record events
const mockEvent = jest.fn(() => {});

const params = {
  name: 'test',
};

const props = {
  componentProps: params,
  onChange: (newParams) => mockEvent(stringify(newParams, 'yaml')),
  isOpen: true,
  onClose: () => mockEvent('close'),
  TypeSpecificParameters: ({ parameters, onChange }) => (
    <input
      className="inputVal"
      value={parameters.inputVal || ''}
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
    const wrapper = mount(<CardModal {...props} />);
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();
  });

  it('calls the close function on cancel', () => {
    const wrapper = mount(<CardModal {...props} />);
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();
    const cancelButton = wrapper
      .find('div[data-test="card-modal"]')
      .find('.btn-secondary')
      .first();
    cancelButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith('close');
    mockEvent.mockClear();
  });

  it('calls the change and close functions on save', () => {
    const wrapper = mount(<CardModal {...props} />);
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();
    const saveButton = wrapper
      .find('div[data-test="card-modal"]')
      .find('.btn-primary')
      .first();
    saveButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent.mock.calls).toEqual([['close'], ['name: test\n']]);
    mockEvent.mockClear();
  });

  it('calls the onChange with a new minimum length when minimum length is altered', () => {
    const wrapper = mount(<CardModal {...props} />);
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();

    const specificField = wrapper
      .find('div[data-test="card-modal"]')
      .first()
      .find('.inputVal')
      .first();
    specificField.simulate('change', { target: { value: 'wow many change' } });

    const saveButton = wrapper
      .find('div[data-test="card-modal"]')
      .find('.btn-primary')
      .first();
    saveButton.simulate('click');
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent.mock.calls).toEqual([
      ['close'],
      ['name: test\ninputVal: wow many change\n'],
    ]);

    mockEvent.mockClear();
  });
});
