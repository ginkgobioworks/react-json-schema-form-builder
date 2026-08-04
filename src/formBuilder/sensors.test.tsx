import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormBuilderKeyboardSensor, FormBuilderPointerSensor } from './sensors';
import type {
  KeyboardSensorOptions,
  PointerSensorOptions,
} from '@dnd-kit/core';

const [pointerActivator] = FormBuilderPointerSensor.activators;
const [keyboardActivator] = FormBuilderKeyboardSensor.activators;

function activatePointer(
  target: Element,
  nativeEvent: Partial<PointerEvent> = {},
) {
  const event = {
    target,
    nativeEvent: { target, isPrimary: true, button: 0, ...nativeEvent },
  };
  return pointerActivator.handler(
    event as unknown as React.PointerEvent,
    {} as PointerSensorOptions,
  );
}

function activateKeyboard(target: Element, code: string) {
  const event = {
    target,
    nativeEvent: { target, code },
    preventDefault: jest.fn(),
  };
  const activated = keyboardActivator.handler(
    event as unknown as React.KeyboardEvent,
    {} as KeyboardSensorOptions,
    { active: { activatorNode: { current: null } } } as unknown as Parameters<
      typeof keyboardActivator.handler
    >[2],
  );
  return { activated, preventDefault: event.preventDefault };
}

describe('form builder sensors', () => {
  beforeEach(() => {
    render(
      <div data-testid='draggable'>
        <input placeholder='Title' />
        <textarea placeholder='Description' />
        <button type='button'>
          <span data-testid='icon' />
        </button>
        <span data-testid='label'>Not interactive</span>
      </div>,
    );
  });

  describe('FormBuilderPointerSensor', () => {
    it('does not activate on a press inside a text field', () => {
      expect(activatePointer(screen.getByPlaceholderText('Title'))).toBe(false);
      expect(activatePointer(screen.getByPlaceholderText('Description'))).toBe(
        false,
      );
    });

    it('does not activate on a press inside a button', () => {
      expect(activatePointer(screen.getByRole('button'))).toBe(false);
      expect(activatePointer(screen.getByTestId('icon'))).toBe(false);
    });

    it('activates on a press outside of an interactive element', () => {
      expect(activatePointer(screen.getByTestId('draggable'))).toBe(true);
      expect(activatePointer(screen.getByTestId('label'))).toBe(true);
    });

    it('still ignores secondary and non-primary pointers', () => {
      const target = screen.getByTestId('draggable');
      expect(activatePointer(target, { button: 2 })).toBe(false);
      expect(activatePointer(target, { isPrimary: false })).toBe(false);
    });
  });

  describe('FormBuilderKeyboardSensor', () => {
    it('does not activate on Space inside a text field', () => {
      const { activated, preventDefault } = activateKeyboard(
        screen.getByPlaceholderText('Title'),
        'Space',
      );
      expect(activated).toBe(false);
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('does not activate on Space inside a button', () => {
      const { activated, preventDefault } = activateKeyboard(
        screen.getByRole('button'),
        'Space',
      );
      expect(activated).toBe(false);
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('activates on Space outside of an interactive element', () => {
      const { activated, preventDefault } = activateKeyboard(
        screen.getByTestId('draggable'),
        'Space',
      );
      expect(activated).toBe(true);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('ignores keys that do not start a drag', () => {
      const { activated } = activateKeyboard(
        screen.getByTestId('draggable'),
        'KeyA',
      );
      expect(activated).toBe(false);
    });
  });
});
