import { KeyboardSensor, PointerSensor } from '@dnd-kit/core';
import type {
  Activators,
  KeyboardSensorOptions,
  PointerSensorOptions,
} from '@dnd-kit/core';
import type { KeyboardEvent, PointerEvent } from 'react';

// Elements whose own pointer and keyboard gestures must win over dragging.
const INTERACTIVE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'option',
  'button',
  'a[href]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

function startsInInteractiveElement(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null
  );
}

const [pointerActivator] = PointerSensor.activators;
const [keyboardActivator] = KeyboardSensor.activators;

/**
 * A `PointerSensor` that does not start a drag when the gesture begins inside
 * an interactive element, so that pressing and dragging within a text field
 * selects text instead of dragging the enclosing form element card.
 */
export class FormBuilderPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: pointerActivator.eventName,
      handler: (event: PointerEvent, options: PointerSensorOptions) =>
        !startsInInteractiveElement(event.nativeEvent.target) &&
        pointerActivator.handler(event, options),
    },
  ];
}

/**
 * A `KeyboardSensor` that ignores its activation keys when they are pressed
 * inside an interactive element, so that typing a space in a text field, or
 * activating a button with Space or Enter, does not start a keyboard drag.
 */
export class FormBuilderKeyboardSensor extends KeyboardSensor {
  static activators: Activators<KeyboardSensorOptions> = [
    {
      eventName: keyboardActivator.eventName,
      handler: (event: KeyboardEvent, options, context) =>
        !startsInInteractiveElement(event.nativeEvent.target) &&
        keyboardActivator.handler(event, options, context),
    },
  ];
}
