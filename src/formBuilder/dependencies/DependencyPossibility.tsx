import React, { useState, ReactElement } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip';
import CardSelector from './CardSelector';
import ValueSelector from './ValueSelector';
import FontAwesomeIcon from '../FontAwesomeIcon';
import { getRandomId } from '../utils';

// a possible dependency
export default function DependencyPossibility({
  possibility,
  neighborNames,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}: {
  possibility: {
    children: Array<string>;
    value?: any;
  };
  neighborNames: Array<string>;
  onChange: (newPossibility: { children: Array<string>; value?: any }) => void;
  onDelete: () => void;
  parentEnums?: Array<string | number>;
  parentType?: string;
  parentName?: string;
  parentSchema?: any;
}): ReactElement {
  const [elementId] = useState(getRandomId());
  return (
    <div className='form-dependency-condition'>
      <h5>
        Display the following:{' '}
        <Tooltip
          id={`${elementId}_bulk`}
          type='help'
          text='Choose the other form elements that depend on this one'
        />
      </h5>
      <CardSelector
        possibleChoices={
          neighborNames.filter((name) => name !== parentName) || []
        }
        chosenChoices={possibility.children}
        onChange={(chosenChoices: Array<string>) =>
          onChange({ ...possibility, children: [...chosenChoices] })
        }
        placeholder='Choose a dependent...'
      />
      <h5>
        If &quot;{parentName}&quot; has{' '}
        {possibility.value ? 'the value:' : 'a value.'}
      </h5>
      <div style={{ display: possibility.value ? 'block' : 'none' }}>
        <ValueSelector
          possibility={possibility}
          onChange={(newPossibility: {
            children: Array<string>;
            value?: any;
          }) => onChange(newPossibility)}
          parentEnums={parentEnums}
          parentType={parentType}
          parentName={parentName}
          parentSchema={parentSchema}
        />
      </div>
      <FontAwesomeIcon icon={faTimes} onClick={() => onDelete()} />
    </div>
  );
}
